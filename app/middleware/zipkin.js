'use strict';
const {Tracer, ExplicitContext, ConsoleRecorder} = require('zipkin');
const recorderConsole = new ConsoleRecorder();

// const {Tracer, ExplicitContext} = require('zipkin');
const {recorder} = require('../../lib/recorder');

const {zipkinCfg} = require('../../config/config.default');

const ctxImpl = new ExplicitContext();

const {
  Annotation,
  HttpHeaders: Header,
  option: {Some, None},
  TraceId
} = require('zipkin');
const url = require('url');

function containsRequiredHeaders(req) {
  return req.header(Header.TraceId) !== undefined &&
    req.header(Header.SpanId) !== undefined;
}

function stringToBoolean(str) {
  return str === '1';
}

function stringToIntOption(str) {
  try {
    return new Some(parseInt(str));
  } catch (err) {
    return None;
  }
}

function formatRequestUrl(req) {
  const parsed = url.parse(req.url);
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: parsed.pathname,
    search: parsed.search
  });
}

let tracer;

async function generateTracer(options){
    let protocalHeader = 'http://';
    if(options && options.httpsOn){
        protocalHeader = 'https://';
    }
    if(options && options.consoleRecorder){
        tracer = new Tracer({ctxImpl: ctxImpl, recorder: recorderConsole})
    } else {
        const baseRecorder = await recorder({
            targetServer: (options && options.targetServer) ? protocalHeader + options.targetServer : protocalHeader + zipkinCfg.targetServer,
            targetApi: (options && options.targetApi) ? options.targetApi : zipkinCfg.targetApi,
            jsonEncoder: (options && options.jsonEncoder) ? options.jsonEncoder : zipkinCfg.jsonEncoder
        });
        tracer = new Tracer({ctxImpl: ctxImpl, recorder: baseRecorder});
    }
}

module.exports = (options) => {
    return async function EggMiddleware(ctx, next, port = 0) {
        await generateTracer(options);
    ctx.req.get = ctx.req.header = (name)=> {
      if (!name)
        throw new TypeError('name argument is required to ctx.req.header');
      if (typeof name !== 'string')
        throw new TypeError('name must be a string to ctx.req.header');
      let lc = name.toLowerCase();
      switch (lc) {
        case 'referer':
        case 'referrer':
          return ctx.req.headers.referrer
            || ctx.req.headers.referer;
        default:
          return ctx.req.headers[lc];
      }
    };
    tracer.scoped(() => {
      function readHeader(header) {
        const val = ctx.req.header(header);
        if (val != null) {
          return new Some(val);
        } else {
          return None;
        }
      }

      if (containsRequiredHeaders(ctx.req)) {
        const spanId = readHeader(Header.SpanId);
        spanId.ifPresent(sid => {
          const traceId = readHeader(Header.TraceId);
          const parentSpanId = readHeader(Header.ParentSpanId);
          const sampled = readHeader(Header.Sampled);
          const flags = readHeader(Header.Flags).flatMap(stringToIntOption).getOrElse(0);
          const id = new TraceId({
            traceId,
            parentId: parentSpanId,
            spanId: sid,
            sampled: sampled.map(stringToBoolean),
            flags
          });
          tracer.setId(id);
        });
      } else {
        tracer.setId(tracer.createRootId());
        if (ctx.req.header(Header.Flags)) {
          const currentId = tracer.id;
          const idWithFlags = new TraceId({
            traceId: currentId.traceId,
            parentId: currentId.parentId,
            spanId: currentId.spanId,
            sampled: currentId.sampled,
            flags: readHeader(Header.Flags)
          });
          tracer.setId(idWithFlags);
        }
      }

      const id = tracer.id;

      tracer.recordServiceName((options && options.serviceName) ? options.serviceName : zipkinCfg.serviceName);
      tracer.recordRpc(ctx.req.method.toUpperCase());
      tracer.recordBinary('http.url', formatRequestUrl(ctx.req));
      tracer.recordAnnotation(new Annotation.ServerRecv());
      tracer.recordAnnotation(new Annotation.LocalAddr({port}));

      if (id.flags !== 0 && id.flags != null) {
        tracer.recordBinary(Header.Flags, id.flags.toString());
      }

      ctx.res.on('finish', () => {
        tracer.scoped(() => {
          tracer.setId(id);
          tracer.recordBinary('http.status_code', ctx.res.statusCode.toString());
          tracer.recordAnnotation(new Annotation.ServerSend());
        });
      });

      // next();
    });
    await next();
  };
};
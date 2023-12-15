/*
 * Copyright (c) 2023 AccelByte Inc. All Rights Reserved
 * This is licensed software from AccelByte Inc, for limitations
 * and restrictions contact your company contract manager.
 */

/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import { PassThrough } from "node:stream";

import type { EntryContext } from "@remix-run/node";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream } from "react-dom/server";

import { renderHeadToString } from "remix-island";
import { Head } from "./root";

import { StyleProvider, createCache, extractStyle } from "@ant-design/cssinjs";

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return isbot(request.headers.get("user-agent"))
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      );
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        onAllReady() {
          shellRendered = true;
          const head = renderHeadToString({ request, remixContext, Head });
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          body.write(
            `<!DOCTYPE html><html><head>${head}</head><body><div id="root">`
          );
          pipe(body);
          body.write("</div></body></html>");
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(err: unknown) {
          responseStatusCode = 500;
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    // 1. create cache for Ant Design CSS style preload
    const cache = createCache();

    const { pipe, abort } = renderToPipeableStream(
      <StyleProvider cache={cache}>
        <RemixServer
          context={remixContext}
          url={request.url}
          abortDelay={ABORT_DELAY}
        />
      </StyleProvider>,
      {
        onShellReady() {
          shellRendered = true;
          // `remix-island` seems like adding these "comments" so that it could be hydrated "late".
          // But sometimes, these late hydrations cause Tailwind to be missing its stylings for a short time.
          //
          // Maybe these late hydrations are intended just in case the client has JavaScript links that modifies DOM,
          // which, if sent instantly along with the original HTML, it may cause hydration error. If that's the case,
          // then I guess we're still safe from it considering that we don't have our own DOM-injector stuff (e.g. widgets, plugins).
          const head = renderHeadToString({ request, remixContext, Head });
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          // 2. Grab style from cache
          const serverStyle = extractStyle(cache, true);

          // 3. Embed both Ant Design <style> into DOM's head
          // Order matters here: ${head} definitely needs to go in first since it contains the meta charset and all that.
          // Then, comes the <style>. <style> needs to come in first before <link>, because otherwise the styles from <link>
          // will be overridden by <style>.
          body.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          ${head}
          <style id="serverInjectedCSS">${serverStyle}</style>
          </head>
          <body>
          <div id="root">`);
          pipe(body);
          body.write("</div></body></html>");
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(err: unknown) {
          responseStatusCode = 500;
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

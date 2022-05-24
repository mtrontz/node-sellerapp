import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import type { MetaFunction, LinksFunction, LoaderFunction } from '@remix-run/node';
import React, {} from "react";
import RootStyles from "~/styles/global.css";

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: RootStyles }];
};

export const meta: MetaFunction = () => {
  return { title: 'New Remix App' };
};

interface LoaderData {
  _raw: ReadableStream<Uint8Array> | null
  _json: Promise<any>
  _text: Promise<string>
  _formData: Promise<FormData>
};
export const loader: LoaderFunction = (request: Request) => {
  let clone = request?.clone();

  let signal = clone?.signal
  if (signal.aborted) return;

  let formData = clone?.formData();
  let body = clone?.body;
  let json = clone?.json();
  let text = clone?.text();

  let credentials = clone?.credentials
  let cache = clone?.cache 
  let headers = clone?.headers;

  let url = clone?.url;
  let mode = clone?.mode;
  let method = clone?.method;

  let redirect = clone?.redirect;
  let referrer = clone?.referrer;
  let policy = clone?.referrerPolicy 
  let destination = clone?.destination;
  let integrity = clone?.integrity;

  
};
export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

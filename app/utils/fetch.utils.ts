import {
  useFetcher
} from 'remix';
import type { MetaFunction, LinksFunction, LoaderFunction } from 'remix';
import React, {} from "react";

// Download a resource with cache busting, to bypass the cache
// completely.
fetch("some.json", {cache: "no-store"})
  .then(function(response) { /* consume the response */ });

// Download a resource with cache busting, but update the HTTP
// cache with the downloaded resource.
fetch("some.json", {cache: "reload"})
  .then(function(response) { /* consume the response */ });

// Download a resource with cache busting when dealing with a
// properly configured server that will send the correct ETag
// and Date headers and properly handle If-Modified-Since and
// If-None-Match request headers, therefore we can rely on the
// validation to guarantee a fresh response.
fetch("some.json", {cache: "no-cache"})
  .then(function(response) { /* consume the response */ });

// Download a resource with economics in mind!  Prefer a cached
// albeit stale response to conserve as much bandwidth as possible.
fetch("some.json", {cache: "force-cache"})
  .then(function(response) { /* consume the response */ });

// Naive stale-while-revalidate client-level implementation.
// Prefer a cached albeit stale response; but update if it's too old.
// AbortController and signal to allow better memory cleaning.
// In reality; this would be a function that takes a path and a
// reference to the controller since it would need to change the value
let controller = new AbortController();
fetch("some.json", {cache: "only-if-cached", mode: "same-origin", signal: controller.signal})
  .catch(e => e instanceof TypeError && e.message === "Failed to fetch" ?
    ({status: 504}) : // Workaround for chrome; which fails with a TypeError
    Promise.reject(e))
  .then(res => {
    if (res.status === 504) {
      controller.abort()
      controller = new AbortController();
      return fetch("some.json", {cache: "force-cache", mode: "same-origin", signal: controller.signal})
    }
    const date = res.headers.get("date"), dt = date ? new Date(date).getTime() : 0
    if (dt < (Date.now() - 86400000)) {
      // if older than 24 hours
      controller.abort()
      controller = new AbortController();
      return fetch("some.json", {cache: "reload", mode: "same-origin", signal: controller.signal})
    }

    // Other possible conditions
    if (dt < (Date.now() - 300000)) // If it's older than 5 minutes
      fetch("some.json", {cache: "no-cache", mode: "same-origin"}) // no cancellation or return value.
    return res
  })
  .then(function(response) { /* consume the (possibly stale) response */ })
  .catch(error => { /* Can be an AbortError/DOMError or a TypeError */ });
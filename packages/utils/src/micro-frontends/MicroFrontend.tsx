// inspired by
// https://github.com/micro-frontends-demo
// https://github.com/micro-frontends-demo/container

import * as React from 'react';

interface MicroFrontendProps {
  id: string;
  jsSrc: string;
  jsIntegrity?: string;
  stylesheetSrc?: string;
  stylesheetIntegrity?: string;
  onReady: () => void;
  onError?: () => void;
  noCache?: boolean;
}

const getResourceLocation = (src, timestamp) => `${src}${timestamp ? `?${timestamp}` : ''}`;

const createScriptTagElement = (src, id, integrity, onReady, onError, timestamp) => {
  const scriptElement = document.createElement('script');
  scriptElement.src = getResourceLocation(src, timestamp);
  scriptElement.onload = onReady;
  scriptElement.onerror = onError;
  if (integrity) {
    scriptElement.integrity = integrity;
  }
  scriptElement.crossOrigin = 'anonymous';
  scriptElement.id = id;
  return scriptElement;
};

const createLinkTagElement = (src, id, integrity, timestamp) => {
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = getResourceLocation(src, timestamp);
  linkElement.id = id;
  if (integrity) {
    linkElement.integrity = integrity;
  }
  linkElement.crossOrigin = 'anonymous';
  return linkElement;
};

const addElementToDOM = elementCreator => {
  const element = elementCreator();
  document.head.appendChild(element);
};

const cleanupExternals = (scriptId, linkId) => {
  document.getElementById(scriptId).remove();
  document.getElementById(linkId).remove();
};

export default ({
  jsSrc,
  stylesheetSrc,
  jsIntegrity,
  stylesheetIntegrity,
  id,
  onReady,
  onError,
  noCache,
}: MicroFrontendProps) => {
  const scriptId = `${id}-js`;
  const linkId = `${id}-styles`;

  React.useEffect(() => {
    let timestamp = '';
    if (noCache) {
      timestamp = `${Date.now()}`;
    }
    if (document.getElementById(scriptId) === null) {
      addElementToDOM(() => createScriptTagElement(jsSrc, scriptId, jsIntegrity, onReady, onError, timestamp));
    }
    if (document.getElementById(linkId) === null && stylesheetSrc) {
      addElementToDOM(() => createLinkTagElement(stylesheetSrc, linkId, stylesheetIntegrity, timestamp));
    }
    return () => cleanupExternals(scriptId, linkId);
  }, []);

  return <main id={id} />;
};

import * as React from 'react';

interface MicroFrontendProps {
  id: string;
  jsSrc: string;
  stylesheetSrc: string;
  onReady: () => void;
  onError: () => void;
}

const scriptId = 'microfrontend-opptjening-js';
const linkId = 'microfrontend-opptjening-css';

const createScriptTagElement = (src, onReady, onError) => {
  const scriptElement = document.createElement('script');
  scriptElement.src = src;
  scriptElement.onload = onReady;
  scriptElement.onerror = onError;
  scriptElement.crossOrigin = '';
  scriptElement.id = scriptId;
  scriptElement.integrity = 'sha384-NG24if4CVSxHnx0mFo2GALNOcB8jBK6LKteXpZKJZ5jV272IqfFMVpQaV2BITwx+';
  return scriptElement;
};

const createLinkTagElement = src => {
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = src;
  linkElement.id = linkId;
  return linkElement;
};

const addElementToDOM = elementCreator => {
  const element = elementCreator();
  document.head.appendChild(element);
};

const cleanupExternals = () => {
  document.getElementById(scriptId).remove();
  document.getElementById(linkId).remove();
};

export default ({ jsSrc, stylesheetSrc, id, onReady, onError }: MicroFrontendProps) => {
  React.useEffect(() => {
    if (document.getElementById(scriptId) === null) {
      addElementToDOM(() => createScriptTagElement(jsSrc, onReady, onError));
    }
    if (document.getElementById(linkId) === null) {
      addElementToDOM(() => createLinkTagElement(stylesheetSrc));
    }
    return cleanupExternals;
  }, []);

  return <main id={id} />;
};

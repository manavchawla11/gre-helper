import { jsonToHtml } from '@contentstack/json-rte-serializer';
import React from 'react';

export default function RenderRTE({ doc }) {
  if (!doc) return null;

  // If sometimes you get plain string (older entries), handle it gracefully
  if (typeof doc === 'string') return <p style={{ marginTop: 0 }}>{doc}</p>;

  // JSON RTE -> HTML
  const html = jsonToHtml(doc);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ lineHeight: 1.5 }}
    />
  );
}

import React from 'react';

interface TemplateProps {
  text: string;
}

const Template = ({ text }: TemplateProps) => <div>{text}</div>;

export default Template;

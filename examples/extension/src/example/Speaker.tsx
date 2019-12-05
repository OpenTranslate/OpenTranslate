import React, { FC } from "react";

export interface SpeakerProps {
  src?: string | null;
}

export const Speaker: FC<SpeakerProps> = React.memo(({ src }) => {
  if (!src) return null;

  return (
    <a
      href={src}
      className="button is-white is-small"
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        new Audio(src).play();
      }}
    >
      <span className="icon has-text-info">
        <i className="fas fa-volume-up"></i>
      </span>
    </a>
  );
});

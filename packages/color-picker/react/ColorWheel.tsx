'use client';
import type { ReactNode } from 'react';
import type { ColorMarker, ColorPartClasses } from '../core';
import {
  ColorMarkerThumb,
  ColorThumb,
  ColorWheelSurface,
  type ColorPlaneProps,
} from './primitives';
export function ColorWheel({
  className = '',
  classes = {},
  thumbText,
  renderMarker,
  markers,
  activeId,
  label = 'Hue and saturation wheel',
  ...attributes
}: Omit<ColorPlaneProps, 'view'> & {
  classes?: ColorPartClasses;
  thumbText?: ReactNode;
  label?: string;
  renderMarker?: (marker: ColorMarker, active: boolean) => ReactNode;
}) {
  return (
    <ColorWheelSurface
      {...attributes}
      {...{ markers, activeId }}
      className={`cp-wheel ${className} ${classes.root ?? ''}`}
      aria-label={label}
    >
      {markers ? (
        markers.map((marker) => (
          <ColorMarkerThumb
            key={marker.id}
            marker={marker}
            active={marker.id === activeId}
            className={`cp-wheel-marker ${classes.marker ?? ''}`}
          >
            <span data-cp-part="marker-text" className={classes.text}>
              {renderMarker
                ? renderMarker(marker, marker.id === activeId)
                : marker.label}
            </span>
          </ColorMarkerThumb>
        ))
      ) : (
        <ColorThumb className={`cp-thumb ${classes.thumb ?? ''}`}>
          <span data-cp-part="thumb-text" className={classes.text}>
            {thumbText}
          </span>
        </ColorThumb>
      )}
    </ColorWheelSurface>
  );
}

import * as L from 'leaflet';

declare module 'leaflet' {

  interface OpacityOptions extends L.ControlOptions {
    collapsed?: boolean
    label?: string
  }

  namespace control {
    function opacity(overlays: Iterable<L.TileLayer> | { [key: string]: L.TileLayer }, options?: OpacityOptions): L.Control;
  }
}
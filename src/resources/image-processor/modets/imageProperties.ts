import * as sharp from 'sharp';

export interface ImageProperties {
  convertProperties?: {
    format: keyof sharp.FormatEnum;
    options?:
      | sharp.OutputOptions
      | sharp.JpegOptions
      | sharp.PngOptions
      | sharp.WebpOptions
      | sharp.AvifOptions
      | sharp.HeifOptions
      | sharp.GifOptions
      | sharp.TiffOptions;
  };
}

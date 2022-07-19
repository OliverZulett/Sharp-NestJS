import { ApiProperty } from '@nestjs/swagger';
import * as sharp from 'sharp';

export class ImageProperties {
  @ApiProperty({
    type: {
      format: {
        type: 'string',
        default: 'png',
      },
    },
  })
  convertProperties: {
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

  @ApiProperty({
    type: {
      width: {
        type: 'number',
        default: 100,
      },
      height: {
        type: 'number',
        default: 100,
      },
    },
  })
  resizeProperties: {
    width?: number;
    height?: number;
    options?: {
      width?: number | undefined;
      height?: number | undefined;
      fit?: keyof sharp.FitEnum | undefined;
      position?: number | string | undefined;
      background?: sharp.Color | undefined;
      kernel?: keyof sharp.KernelEnum | undefined;
      withoutEnlargement?: boolean | undefined;
      withoutReduction?: boolean | undefined;
      fastShrinkOnLoad?: boolean | undefined;
    };
  };

  @ApiProperty({
    type: {
      left: {
        type: 'number',
        default: 0,
      },
      top: {
        type: 'number',
        default: 0,
      },
      width: {
        type: 'number',
        default: 100,
      },
      height: {
        type: 'number',
        default: 100,
      },
    },
  })
  cropProperties: {
    left: number;
    top: number;
    width: number;
    height: number;
  };

  @ApiProperty({
    type: {
      angle: {
        type: 'number',
        default: 45,
      },
      options: {
        type: {
          background: {
            type: 'string',
            default: 'transparent',
          },
        },
      },
    },
  })
  rotateProperties: {
    angle?: number;
    options?: sharp.RotateOptions;
  };

  @ApiProperty({
    type: 'boolean',
    default: true,
  })
  horizontalFlip: boolean;

  @ApiProperty({
    type: 'boolean',
    default: true,
  })
  verticalFlip: boolean;

  @ApiProperty({
    type: {
      median: {
        type: 'number',
        default: 3,
      },
      blur: {
        type: 'number',
        default: 0.3,
      },
      negate: {
        type: 'boolean',
        default: false,
      },
      grayscale: {
        type: 'boolean',
        default: false,
      },
      threshold: {
        type: 'number',
        default: 120,
      },
      thresholdGrayscale: {
        type: 'boolean',
        default: false,
      },
      brightness: {
        type: 'number',
        default: 1,
      },
      saturation: {
        type: 'number',
        default: 1,
      },
      hue: {
        type: 'number',
        default: 0,
      },
      lightness: {
        type: 'number',
        default: 1,
      },
      tint: {
        type: 'string',
        default: 'red',
      },
    },
  })
  effectsProperties: {
    median: number;
    blur: number;
    negate: boolean;
    grayscale: boolean;
    threshold: number;
    thresholdGrayscale: boolean;
    brightness: number;
    saturation: number;
    hue: number;
    lightness: number;
    tint: sharp.Color;
  };

  @ApiProperty({
    type: 'number',
    default: 0,
  })
  trimLevel: number;

  @ApiProperty({
    type: 'string',
    default: 'transparent',
  })
  transparencyBackgroundColor: sharp.Color;
}

import {
  createSmoothSvgPath,
  getAudioData,
  MediaUtilsAudioData,
  visualizeAudioWaveform,
} from "@remotion/media-utils";
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  Img,
  Series,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const PropsSchema = z.object({
  thumbnail: z.string(),
  audioUrls: z.string().array(),
  audioList: z
    .object({
      src: z.string(),
      duration: z.number(),
    })
    .array()
    .optional(),
});

const height = 200;

export const HelloWorld: React.FC<z.infer<typeof PropsSchema>> = ({
  thumbnail,
  audioList,
}) => {
  const [audioDatas, setAudioDatas] = useState<MediaUtilsAudioData[]>([]);
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const [handler] = useState(() =>
    delayRender("Hello World", { timeoutInMilliseconds: 100000 }),
  );
  useEffect(() => {
    (async () => {
      const _audioDatas = await Promise.all(
        audioList!.map((audio) => {
          return getAudioData(audio.src);
        }),
      );
      console.log(_audioDatas);
      setAudioDatas(_audioDatas);
      continueRender(handler);
    })();
  }, []);
  if (!audioDatas.length) return null;
  return (
    <AbsoluteFill style={{ backgroundColor: "white" }}>
      <Img src={thumbnail} />
      <Series>
        {audioList?.map((audio, index) => {
          const vi = visualizeAudioWaveform({
            fps,
            frame,
            audioData: audioDatas[index],
            numberOfSamples: 16,
            windowInSeconds: 1 / fps,
          });
          const p = createSmoothSvgPath({
            points: vi.map((x, i) => {
              return {
                x: (i / (vi.length - 1)) * width,
                y: (x - 0.5) * height + height / 2,
              };
            }),
          });

          return (
            <Series.Sequence
              key={audio.src}
              durationInFrames={audio.duration * fps}
              offset={fps}
            >
              <Audio src={audio.src} />
              <AbsoluteFill
                style={{ justifyContent: "flex-end", alignItems: "end" }}
              >
                <svg
                  style={{}}
                  viewBox={`0 0 ${width} ${height}`}
                  width={width}
                  height={height}
                >
                  <path
                    stroke="white"
                    fill="none"
                    strokeWidth={5}
                    d={p as string}
                  />
                </svg>
              </AbsoluteFill>
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};

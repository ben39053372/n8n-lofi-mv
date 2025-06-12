import { AbsoluteFill, Audio, Img, Series, useVideoConfig } from "remotion";
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

export const HelloWorld: React.FC<z.infer<typeof PropsSchema>> = ({
  thumbnail,
  audioList,
}) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "white" }}>
      <Img src={thumbnail} />
      <Series>
        {audioList?.map((audio) => [
          <Series.Sequence
            key={audio.src}
            durationInFrames={audio.duration * fps}
            offset={fps}
          >
            <Audio src={audio.src} />
          </Series.Sequence>,
        ])}
      </Series>
    </AbsoluteFill>
  );
};

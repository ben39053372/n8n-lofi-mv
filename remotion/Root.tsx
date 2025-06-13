import { Composition } from "remotion";
import { HelloWorld, PropsSchema } from "./HelloWorld";
import { getAudioDurationInSeconds } from "@remotion/media-utils";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  const fps = 30;
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render src/index.ts <id> out/video.mp4
        id="HelloWorld"
        component={HelloWorld}
        fps={fps}
        width={1920}
        height={1080}
        schema={PropsSchema}
        defaultProps={{
          audioUrls: [],
          thumbnail: "https://placehold.co/600x400",
          audioList: [],
        }}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        calculateMetadata={async ({ props }) => {
          const data = await Promise.all(
            props.audioUrls.map(async (url) => {
              const duration = await getAudioDurationInSeconds(url);
              return {
                src: url,
                duration,
              };
            }),
          );
          console.log({ data });
          return {
            props: {
              ...props,
              audioList: data,
            },
            durationInFrames:
              Math.round(
                data
                  .map((d) => d.duration)
                  .reduce((acc, curr) => acc + curr, 0) * fps,
              ) || 1,
          };
        }}
      />
    </>
  );
};

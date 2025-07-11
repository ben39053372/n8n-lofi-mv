import { Composition, continueRender, delayRender } from "remotion";
import { HelloWorld, PropsSchema } from "./HelloWorld";
import { getAudioData } from "@remotion/media-utils";

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
          const mainHandler = delayRender("calculateMetadata", {
            timeoutInMilliseconds: 100000,
          });
          const data = await Promise.all(
            props.audioUrls.map(async (url) => {
              const handle = delayRender(url, {
                timeoutInMilliseconds: 100000,
              });
              const audioData = await getAudioData(url);
              // const duration = await getAudioDurationInSeconds(url);
              continueRender(handle);
              return {
                src: url,
                duration: audioData.durationInSeconds,
                // audioData: JSON.stringify(audioData),
              };
            }),
          );
          continueRender(mainHandler);
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

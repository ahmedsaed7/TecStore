import { ScrollViewStyleReset } from 'expo-router/html';

// This function is used for configuring the root HTML for every
// web page during static rendering. Note that this code only runs
// in Node.js environments and doesn't access the DOM or browser APIs.
export default function Root({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* 
          Disable body scrolling on web to make ScrollView components behave
          more like they do on native. This can be removed for mobile web 
          if body scrolling is desired.
        */}
        <ScrollViewStyleReset />

        {/* CSS styles to ensure consistent background color in dark mode. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
        {/* Additional <head> elements can be added here... */}
      </head>
      <body>{children}</body>
    </html>
  );
}

// CSS to manage background color based on the color scheme
const responsiveBackground = `
body {
  background-color: #fff;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}`;

const { createGlobalStyle } = require("styled-components");

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;

    /* background-color: #282c34;
    color: white; */

    height: 100vh;
    width: 100vw;

    font-family: 'Roboto';
  }

  #root {
    height: 100%;
    width: 100%;
  }
`;

export default GlobalStyle;

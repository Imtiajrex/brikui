type CSSVariables = {
  light: Record<string, string>;
  dark: Record<string, string>;
};

function extractCSSVariables(cssContent: string): CSSVariables {
  // Improved regular expressions to match light and dark mode variable blocks
  const lightModeRegex = /(:root)\s*{([^}]+)}/s;
  const darkModeRegex = /\.dark\s*{([^}]+)}/s;

  // Helper function to parse variables from a block
  const parseVariables = (block: string): Record<string, string> => {
    const variables: Record<string, string> = {};

    // Split the block into lines and process each line
    block
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('--'))
      .forEach((line) => {
        const [key, value] = line.split(':').map((part) => part.trim());
        // Remove the '--' prefix and semicolon
        variables[key.replace(/^--/, '')] = value.replace(/;$/, '');
      });

    return variables;
  };

  // Extract and parse variables
  const lightModeMatch = cssContent.match(lightModeRegex);
  const darkModeMatch = cssContent.match(darkModeRegex);

  const lightVariables = lightModeMatch ? parseVariables(lightModeMatch[2]) : {};

  const darkVariables = darkModeMatch ? parseVariables(darkModeMatch[1]) : {};

  return {
    light: lightVariables,
    dark: darkVariables,
  };
}

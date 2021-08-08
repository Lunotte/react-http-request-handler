module.exports = {
    preset: 'react-native',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    modulePathIgnorePatterns: [
      "<rootDir>/lib/"
  ],
  collectCoverageFrom: [
    "src/*/*.{js,ts,jsx,tsx}", // * désigne le repertoire à ce niveau
    "!src/**/index.{js,ts}", // ** désigne tous les sous répertoires entre src et le fichier
    "!src/models/**"
  ]
};
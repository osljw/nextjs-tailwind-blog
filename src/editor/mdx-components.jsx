export function useMDXComponents() {
  return {
    Planet() {
      return 'Pluto'
    },
    h1(props) {
      return <h2 {...props} />
    },
  }
}

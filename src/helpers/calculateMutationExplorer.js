export default function calculateMutationExplorer(event, mutationExplorerPath) {
  if (event.mutationPaths && mutationExplorerPath !== null) {
    event.mutationExplorer = event.mutationPaths
      .filter(mPath => mPath.toString().indexOf(mutationExplorerPath.toString()) === 0)
      .length > 0;
  }
};

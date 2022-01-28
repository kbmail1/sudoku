async function arrangePromises(
  action: Promise<any>,
  onSuccess: (result: any) => Promise<any>,
  onSecondSuccess: (result: any) => void,
  onError: (error: any) => void,
  cleanup: () => void
) {
  // try-catch block will catch any error thrown by promises
  try {
    // 1. wait for action to resolve
    const result = await action;
    // 2. call the onSuccess when action is resolved
    const result2 = await onSuccess(result);

    // 3. call the onSecondSuccess when onSuccess is resolved
    onSecondSuccess(result2);

    // 4. call onError if there was any error in given promises
  } catch (error) {
    onError(error);

    // 5. call cleanup, doesn't matter if there were any errors or not
  } finally {
    cleanup();
  }
}

arrangePromises(
  Promise.resolve("First promise!"),
  (result: any) => {
    console.log(result);

    return Promise.resolve("Second promise!");
  },
  (result: any) => console.log(result),
  (error: any) => console.log("Error:", error),
  () => console.log("Cleanup!")
);

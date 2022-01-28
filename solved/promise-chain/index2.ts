function arrangePromises2(
  action: Promise<any>,
  onSuccess: (result: any) => Promise<any>,
  onSecondSuccess: (result: any) => void,
  onError: (error: any) => void,
  cleanup: () => void
) {
  // TODO: implement this function, based on description in
  // attached screenshot.

  // 1. calling the first arg: action
  action

    // 2. call the onSuccess when action is resolved
    .then(onSuccess)

    // 3. call the onSecondSuccess when onSuccess is resolved
    .then(onSecondSuccess)

    // 4. if any given promise is rejected/failed, run onError
    .catch(onError)

    // 5. just cleanup.
    .finally(cleanup);
}

// [] - stack is cleared before it jumps to the (action) queue.

arrangePromises2(
  Promise.resolve("First promise!"),
  (result: any) => {
    console.log(result);
    return Promise.resolve("Second promise!");
  },
  (result: any) => console.log(result),
  (error: any) => console.log("Error:", error),
  () => console.log("Cleanup!")
);

// expected output
// First promise!  Second promise!  Cleanup!

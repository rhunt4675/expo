---
title: BackgroundFetch
---

Provides API to perform [background fetch](https://developer.apple.com/documentation/uikit/core_app/managing_your_app_s_life_cycle/preparing_your_app_to_run_in_the_background/updating_your_app_with_background_app_refresh) tasks. This module uses [TaskManager](../task-manager) Native API under the hood.
In order to use `BackgroundFetch` API in standalone and detached apps on iOS, your app has to include background mode in the `Info.plist` file. See [background tasks configuration guide](../task-manager#configuration-for-standalone-apps) for more details.

### `BackgroundFetch.getStatusAsync()`

Gets a status of background fetch.

#### Returns

Returns a promise resolving to one of these values:
-   `BackgroundFetch.Status.Restricted` — Background updates are unavailable and the user cannot enable them again. This status can occur when, for example, parental controls are in effect for the current user.
-   `BackgroundFetch.Status.Denied` - The user explicitly disabled background behavior for this app or for the whole system.
-   `BackgroundFetch.Status.Available` - Background updates are available for the app.

### `BackgroundFetch.registerTaskAsync(taskName, options)`

Registers background fetch task with given name. Registered tasks are saved in persistent storage and restored once the app is initialized.

#### Arguments

-   **taskName (_string_)** -- Name of the task to register. The task needs to be defined first - see [TaskManager.defineTask](../task-manager#taskmanagerdefinetasktaskname-task) for more details.
-   **options (_object_)** -- An object of options:
    -   **minimumInterval (_number_)** -- Inexact interval in seconds between subsequent repeats of the background fetch alarm. The final interval may differ from the specified one to minimize wakeups and battery usage.
    On Android it defaults to **15 minutes**. On iOS it calls [BackgroundFetch.setMinimumIntervalAsync](#backgroundfetchsetminimumintervalasyncminimuminterval) behind the scenes and the default value is the smallest fetch interval supported by the system (**10-15 minutes**).
    -   **stopOnTerminate (_boolean_)** -- Whether to stop receiving background fetch events after user terminates the app. Defaults to `true`. (**Android only**)
    -   **startOnBoot (_boolean_)** -- Whether to restart background fetch events when the device has finished booting. Defaults to `false`. (**Android only**)

#### Returns

Returns a promise that resolves once the task is registered and rejects in case of any errors.

#### Task parameters

Background fetch task receives no data, but your task should return a value that best describes the results of your background fetch work.
-   `BackgroundFetch.Result.NoData` - There was no new data to download.
-   `BackgroundFetch.Result.NewData` - New data was successfully downloaded.
-   `BackgroundFetch.Result.Failed` - An attempt to download data was made but that attempt failed.

This return value is to let iOS know what the result of your background fetch was, so the platform can better schedule future background fetches. Also, your app has up to 30 seconds to perform the task, otherwise your app will be terminated and future background fetches may be delayed.

```javascript
import { BackgroundFetch, TaskManager } from 'expo';

TaskManager.defineTask(YOUR_TASK_NAME, () => {
  try {
    const receivedNewData = // do your background fetch here
    return receivedNewData ? BackgroundFetch.Result.NewData : BackgroundFetch.Result.NoData;
  } catch (error) {
    return BackgroundFetch.Result.Failed;
  }
});
```

### `BackgroundFetch.unregisterTaskAsync(taskName)`

Unregisters background fetch task, so the application will no longer be executing this task.

#### Arguments

-   **taskName (_string_)** -- Name of the task to unregister.

#### Returns

A promise resolving when the task is fully unregistered.

### `BackgroundFetch.setMinimumIntervalAsync(minimumInterval)`

Sets the minimum number of seconds that must elapse before another background fetch can be initiated. This value is advisory only and does not indicate the exact amount of time expected between fetch operations.

*This method doesn't take any effect on Android.*

*It is a global value which means that it can overwrite settings from another application opened through Expo Client.*

#### Arguments

-   **minimumInterval (_number_)** -- Number of seconds that must elapse before another background fetch can be called.

#### Returns

A promise resolving once the minimum interval is set.

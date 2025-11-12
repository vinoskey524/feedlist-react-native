# feedlist <img src="assets/logo.png" alt="logo" width="40" height="40" style="vertical-align:bottom;">

A highly efficient and high-performance feeds renderer, designed for React and React Native (Bare and Expo).

[Official Documentation](https://package524.vercel.app)

[Click to access the **React** version’s source code.](https://github.com/vinoskey524/feedlist-react)

## Table of contents

- [Installation](#installation)
- [What's feedlist](#whats-feedlist)
- [Features](#features)
- [Component & Props](#component--props)
- [Hooks](#hooks)
    - [useIsMounted](#useIsMounted)
    - [useFeedListRef](#useFeedListRef)
    - [useScrollEvent](#useScrollEvent)
    - [useScrollAmount](#useScrollAmount)
    - [useVisibleFeeds](#useVisibleFeeds)
    - [useIsHeaderVisible](#useIsHeaderVisible)
    - [useIsFooterVisible](#useIsFooterVisible)
    - [useIsListEndReached](#useIsListEndReached)
- [Methods](#methods)
    - [renderFeeds](#renderfeeds)
    - [updateFeeds](#updatefeeds)
    - [removeFeeds](#removefeeds)
    - [restoreFeeds](#restorefeeds)
    - [refresh](#refresh)
    - [scrollTo](#scrollto)
    - [toggleScroll](#togglescroll)
    - [getNextSibling](#getnextsibling)
    - [getPrevSibling](#getprevsibling)
    - [getRange](#getrange)
    - [getFeedFromIndex](#getfeedfromindex)
    - [updateProps](#updateprops)
    - [getVisibleFeeds](#getvisiblefeeds)
    - [isHeaderVisible](#isheadervisible)
    - [isFooterVisible](#isfootervisible)
    - [clearList](#clearlist)
    - [resetProps](#resetprops)
- [Author](#author)
- [Other packages](#other-packages)
- [Contact Me](#contact-me)
- [License](#license)

## Installation

```sh
# npm
$ npm install @vinoskey524/feedlist-react
$ npm install @vinoskey524/feedlist-react-native

# yarn
$ yarn add @vinoskey524/feedlist-react
$ yarn add @vinoskey524/feedlist-react-native

# pnpm
$ pnpm add @vinoskey524/feedlist-react
$ pnpm add @vinoskey524/feedlist-react-native

# bun
$ bun add @vinoskey524/feedlist-react
$ bun add @vinoskey524/feedlist-react-native
```

## What's feedlist

FeedList allows you to display a list of dynamic content (feeds) in both web (React) and mobile (React Native) applications. It’s designed to be flexible, performant, and easy to integrate.

## Features

- Render a list of feeds dynamically from an array or API.

- Supports both React and React Native.

- Handles scrolling, lazy loading and **resume**.

- Provides **custom hooks** for the FeedList logic.

- Easy to style and customize for web or mobile.

- Designed for **infinite scrolling**.

- Optimized for performance and efficient rendering.

## Component & Props

>Note: Pay a good attention to the comments inside the code sections.

- Import

```ts
// React
import FeedList, {
  FL_PUBLIC_APIs_TYPE, FL_ERROR_SOURCE_TYPE,
  useFeedListRef, useIsFooterVisible, useIsHeaderVisible, useIsListEndReached,
  useIsMounted, useScrollAmount, useScrollEvent, useVisibleFeeds
} from '@vinoskey524/feedlist-react';

// React Native
import FeedList, {
  FL_PUBLIC_APIs_TYPE, FL_ERROR_SOURCE_TYPE,
  useFeedListRef, useIsFooterVisible, useIsHeaderVisible, useIsListEndReached,
  useIsMounted, useScrollAmount, useScrollEvent, useVisibleFeeds
} from '@vinoskey524/feedlist-react-native';
```

- FeedList

```tsx
const feedlistRef = useRef<FL_PUBLIC_APIs_TYPE>(null);
<FeedList
    /* 
    * 
    * 1. Required
    * 
    */

    // 1.1. Attach the ref.
    //      • It serves as remote controller to trigger methods from the FeedList component.
    //      • (RefObject) - [required]
    ref={feedlistRef}

    // 1.2. The ID of the FeedList.
    //      • It must be unique and immutable during all the lifetime of the app.
    //      • Please use a "string literal" and not an auto generated ID. (Very important)
    //      • For example, you can use the name of the parent component as ID, as two components can never have the same name.
    //      • (string) - [required]
    id='app'

    // 1.3. The orientation of the FeedList.
    //      • (vertical | horizontal) - [required]
    orientation='vertical'

    // 1.4. The unique key used to identify each feed.
    //      • Here we'll use "id" as primary key.
    //      • (string) - [required]
    primaryKey='id'

    // 1.5. A list of feeds.
    //      • Feeds are lazy loaded, so no matter the size of the list just pass it. 
    //      • Don't try to send them in chunks.
    //      • If you don't want to render any feeds yet, just set an empty array.
    //      • (json[]) - [required]
    feeds={emojis}

    // 1.6. A function that returns the feeds component.
    //      • @param "data": (json) It's the feed's data.
    //      • @param "key": (string) The unique key to identify each feed.
    //      • (Sync Function) - [required]
    feedComponent={(data: any, key: string) => <Feed key={key} data={data} />}



    /* 
    *
    * 2. Custom
    * 
    */

    // 2.1. Custom style.
    //      • (json) - [optional]
    style={{ flex: 1 }}

    // 2.2. Number of columns.
    //      • Available only when the "orientation" is vertical.
    //      • The default value is "1".
    //      • (auto | number) - [optional]
    columns={1}

    // 2.3. If true, the scroll indicator is hidden.
    //      • The Default value if "false".
    //      • (Boolean) - [optional]
    hideScrollIndicator={false}

    // 2.4. If false, the hot updates applied will be maintained, even when the component unmounts and mounts again.
    //      • Default value is "true".
    //      • (Boolean) - [optional]
    alwaysResetProps={false}

    // 2.5. If true, the FeedList will resume from the last scroll position when it unmounts and mounts again.
    //      • When true, it will also prevent props from being reset, even when "alwaysResetProps" is true.
    //      • Default value is "false".
    //      • (Boolean) - [optional]
    resume={false}



    /* 
    *
    * 3. Components
    * 
    */

    // 3.1. A component that will be used as header.
    //      • It's available only when the orientation is "vertical".
    //      • (JSX.Element) - [optional]
    // React Native only
    headerComponent={<Header />}

    // 3.2. When true, the header is hidden when scrolling down, and dock at the top when scrolling up.
    //      • It's available only when the orientation is "vertical".
    //      • It requires the presence of "headerComponent".
    //      • The Default value if "false".
    //      • (Boolean) - [optional]
    // React Native only
    hideHeaderOnScroll={true}

    // 3.3. A component that will be used as footer.
    //      • It's available only when the orientation is "vertical".
    //      • (JSX.Element) - [optional]
    // React Native only
    footerComponent={<Footer />}

    // 3.4. When true, the footer is hidden when scrolling down, and dock at the bottom when scrolling up.
    //      • It's available only when the orientation is "vertical".
    //      • It requires the presence of "footerComponent".
    //      • The Default value if "false".
    //      • (Boolean) - [optional]
    // React Native only
    hideFooterOnScroll={true}

    // 3.5. A component that will be used as placeholder when the list is empty.
    //      • (JSX.Element) - [optional]
    emptyComponent={<Text>No feed!</Text>}

    // 3.6. A component that will be used as loading indicator.
    //      • Available for orientation "vertical" only.
    //      • (JSX.Element) - [optional]
    loadingComponent={<Text>Loading...</Text>}



    /* 
    *
    * 4. Callbacks
    *    • Please, notice that the logs in the console may impact performance!
    *    • Here, we'll use them only for demo purpose.
    *    • You can comment the "onFeedVisible" callback if your test isn't focused on it, because it logs a lot of times.
    * 
    */

    // 4.1. It fires once every time the user refreshes the list.
    //      • (Sync Function) - [optional]
    onRefresh={() => { console.log('onRefresh :: List refreshed!') }}

    // 4.2. It fires once every time a feed becomes visible or invisible.
    //      • @param "id": (string) The ID or the primary key of the feed.
    //      • @param "isVisible": (boolean) A boolean.
    //      • @param "rect": The offsets and dimensions of the feed.
    //          - "width": The feed's width, in pixel.
    //          - "height": The feed's height, in pixel.
    //          - "x": The feed's offset left, in pixel.
    //          - "y": The feed's offset top, in pixel.
    //      • (Sync Function) - [optional]
    onFeedVisible={(id: string, isVisible: boolean, rect: {width: number, height: number, x: number, y: number}) => { 
      console.log('onFeedVisible ::', isVisible, id, rect);
    }}

    // 4.3. It fires once every time the header is hidden on scroll.
    //      • It requires the presence of "headerComponent" and "hideHeaderOnScroll" to be true.
    //      • (Sync Function) - [optional]
    // React Native only
    onHeaderHidden={(isHidden: boolean) => { console.log('onHeaderHidden ::', isHidden) }}

    // 4.4. It fires once every time the footer is hidden on scroll.
    //      • It requires the presence of "footerComponent" and "hideFooterOnScroll" to be true.
    //      • (Sync Function) - [optional]
    // React Native only
    onFooterHidden={(isHidden: boolean) => { console.log('onFooterHidden ::', isHidden) }}

    // 4.5. It fires once every time the list end is about to be reached.
    //      • (Sync Function) - [optional]
    onListEndClose={() => { console.log('onListEndClose :: The list end is about to be reached!') }}

    // 4.6. It fires once every time the user reaches the end of the list.
    //      • (Sync Function) - [optional]
    onListEndReached={() => { console.log('onListEndReached :: List end reached!') }}

    // 4.7. It fires once every time an error occurs while executing a callback.
    //      • @param "source": (string) The name of the faulty callback.
    //      • @param "message": (string) The error message.
    //      • (Sync Function) - [optional but recommended if you're using callbacks]
    onError={(source: FL_ERROR_SOURCE_TYPE, message: string) => { console.log('onError ::', source, message) }}
/>
```

## Hooks

- ### **`useFeedListRef`**:

```ts
// It returns the "ref" of the FeedList component.
// • You can use it to obtain the ref of the FeedList anywhere.
// • No need to specify the type "FL_PUBLIC_APIs_TYPE".
// • It takes as argument the "id" of the FeedList component.
// • When the FeedList component is unmounted, it'll return undefined.
const feedlistRef = useFeedListRef('app');
console.log('feedlistRef ::', feedlistRef);
```

- ### **`useIsMounted`**:

```ts
// It returns "true" when the FeedList component is mounted and "false" otherwise.
// • It takes as argument the "id" of the FeedList component.
const isMounted = useIsMounted('app');
console.log('isMounted ::', isMounted);
```

- ### **`useScrollEvent`**:

```ts
// Get scroll event about target FeedList component
// • It takes as argument the "id" of the FeedList component.
// • When the FeedList component is unmounted, it'll return undefined.
const scrollEvent = useScrollEvent('app');
console.log('scrollEvent ::', scrollEvent);
```

```sh 
# log 
scrollEvent :: { 
  "isScrolling": false, // Is "true" when scrolling.
  "orientation": "vertical", // The current orientation of the FeedList component.
  "scrollDirectionX": undefined, // Can be : "goin_left" | "goin_right" | undefined
  "scrollDirectionY": undefined, // Can be : "goin_down" | "goin_up" | undefined
}
```

- ### **`useScrollAmount`**:

```ts
// It returns an object indicating the scroll amount.
// • It takes as argument the "id" of the FeedList component.
// • When the FeedList component is unmounted, it'll return undefined.
const scrollAmount = useScrollAmount('app');
console.log('scrollAmount ::', scrollAmount);
```

```sh 
# log 
scrollAmount :: { 
  "prev": 0, // Previous scroll amount, from 0 to 100.
  "current": 6.06426735218508997, // Current scroll amount, from 0 to 100.
  "endReached": false // Is "true" when the end of the list is reached.
}
```

- ### **`useVisibleFeeds`**:

```ts
// It returns a list (array) of the visible feeds.
// • It takes as argument the "id" of the FeedList component.
// • When the FeedList component is unmounted, it'll return undefined.
const visibleFeeds = useVisibleFeeds('app');
console.log('visibleFeeds ::', visibleFeeds);
```

```sh
# log
visibleFeeds :: [
  {
    "feedId": "BH4fjxmZjL",
    "index": 0,
    "x": 0,
    "y": -1,
    "width": 390,
    "height": 60
  },
  {
    "feedId": "eHjLZi90",
    "index": 1,
    "x": 0,
    "y": 59,
    "width": 390,
    "height": 60
  },
  {
    "feedId": "3jL8Y0UZ",
    "index": 2,
    "x": 0,
    "y": 119,
    "width": 390,
    "height": 60
  },
  ... more
]
```

- ### **`useIsHeaderVisible`**:

```ts
// It returns "true" when the header is visible and "false" otherwise.
// • It takes as argument the "id" of the FeedList component.
// • When the FeedList component is unmounted, it'll return undefined.
// React Native only
const isHeaderVisible = useIsHeaderVisible('app');
console.log('isHeaderVisible ::', isHeaderVisible);
```

- ### **`useIsFooterVisible`**:

```ts
// It returns "true" when the footer is visible and "false" otherwise.
// • It takes as argument the "id" of the FeedList component.
// • When the FeedList component is unmounted, it'll return undefined.
// React Native only
const isFooterVisible = useIsFooterVisible('app');
console.log('isFooterVisible ::', isFooterVisible);
```

- ### **`useIsListEndReached`**:

```ts
// It returns "true" when the list end is reached and "false" otherwise.
// • It takes as argument the "id" of the FeedList component.
// • When the FeedList component is unmounted, it'll return undefined.
const isListEndReached = useIsListEndReached('app');
console.log('isListEndReached ::', isListEndReached);
```

## Methods

### **renderFeeds**

```ts
// 1. Render feeds at the "top" of the list.
// • The list will automatically scroll to the top.
// • It returns "done" when everything goes well and "undefined" if something goes wrong.
feedlistRef.current?.renderFeeds({
  position: 'top',
  feeds: [
    { "id": "france", "icon": "🇫🇷", "name": "France", "index": 201 },
    { "id": "united_states", "icon": "🇺🇸", "name": "United States", "index": 202 }
  ],
  scrollTopTop: true
});

// 2. Render feeds at the "bottom" of the list.
// • This will render at the end of the list.
// • It returns "done" when everything goes well and "undefined" if something goes wrong.
feedlistRef.current?.renderFeeds({
  position: 'bottom',
  feeds: [
    { "id": "united_kingdom", "icon": "🇬🇧", "name": "United Kingdom", "index": 203 },
    { "id": "germany", "icon": "🇩🇪", "name": "Germany", "index": 204 }
  ]
});

// 3. Render feeds "before" the target feed.
// • It returns "done" when everything goes well and "undefined" if something goes wrong.
feedlistRef.current?.renderFeeds({
  position: 'before',
  targetId: 'grinning_face', // The first emoji
  feeds: [
    { "id": "canada", "icon": "🇨🇦", "name": "Canada", "index": 205 },
    { "id": "japan", "icon": "🇯🇵", "name": "Japan", "index": 206 }
  ]
});

// 4. Render feeds "after" the target feed.
// • It returns "done" when everything goes well and "undefined" if something goes wrong.
feedlistRef.current?.renderFeeds({
  position: 'after',
  targetId: 'grinning_face', // The first emoji
  feeds: [
    { "id": "south_korea", "icon": "🇰🇷", "name": "South Korea", "index": 207 },
    { "id": "china", "icon": "🇨🇳", "name": "China", "index": 208 }
  ]
});
```

- **`renderFeeds(*)`**: It takes as argument a JSON object with the following properties:

  - `position`: (`top | bottom | before | after`) The position at which you want to render new feeds.
  
  - `feeds`: (`json[]`) The list of new feeds.
  
  - `targetId`: (`string`) The ID of the feed before or after which you want to render new feeds. It's required only for positions "before" and "after".

  - `scrollToTop?`: (`boolean`) If true, the list scrolls to the top. It only available for position "top".

### **updateFeeds**

```ts
// Update the first emoji data inside the FeedList.
// • ⚠️ Please note that every time a feed is updated, you should ALWAYS update also inside FeedList 
//   to maintain a consistency between the data and what's rendering.
// • Use an array to update many feeds.
// • It returns "done" when everything goes well and "undefined" if something goes wrong.
// • If an error occurs, it'll be logged inside the console.
const update = feedlistRef.current?.updateFeeds({
  feeds: { 
    "id": "grinning_face", // ⚠️ Make sure that the ID (primary key) is always present and hasn't changed.
    "icon": "😀",
    "name": "Grinning Face UPDATED", // updated
    "index": 1000 // updated
  }
});
console.log('update ::', update);
```

- **`updateFeeds(*)`**: It takes as argument a JSON object with the following property:
  
  - `feeds`: (`json | json[]`) The list of updated feeds

### **removeFeeds**

```ts
// Remove the first feed from the list
// • Use an array to remove many feeds.
// • It returns "done" when everything goes well and "undefined" if something goes wrong.
// • If an error occurs, it'll be logged inside the console.
const remove = feedlistRef.current?.removeFeeds({
  feedsId: 'grinning_face' // First feed
});
console.log('remove ::', remove);
```

- **`removeFeeds(*)`**: It takes as argument a JSON object with the following property:
  
  - `feedsId`: (`string | string[]`) The IDs of the feeds you want to remove.

### **restoreFeeds**

```ts
// Restore a removed feed.
// • Use an array to restore many feeds.
// • It returns "done" when everything goes well and "undefined" if something goes wrong.
// • If an error occurs, it'll be logged inside the console.
const restore = feedlistRef.current?.restoreFeeds({
  feedsId: 'grinning_face' // First feed
});
console.log('restore ::', restore);
```

- **`restoreFeeds(*)`**: It takes as argument a JSON object with the following property:

  - `feedsId`: (`string | string[]`) The IDs of the feeds you want to restore.

### **refresh**

```ts 
// Refresh the list.
// • It returns void.
feedlistRef.current?.refresh();
```

### **scrollTo**

```ts
// 1. Scroll to an offset.
feedlistRef.current?.scrollTo({
  to: 100,
  animate: true
});

// 2. Scroll to a feed.
feedlistRef.current?.scrollTo({
  to: 'upside_down_face', // The 10th emoji
  animate: true
});

// 3. Use a negative value to scroll to the end of the list.
feedlistRef.current?.scrollTo({
  to: -1,
  animate: true
});
```

- **`scrollTo(*)`**: It takes as argument a JSON object with the following properties:
  
  - `to`: (`number | string`) The offset or the id of the feed to scroll to.

  - `animate`: (`boolean`) If true, scroll with a smooth animation.

It returns void.

### **toggleScroll**

```ts
// Enable/Disable scroll.
// • It returns void.
feedlistRef.current?.toggleScroll({ enable: true });
```

- **`toggleScroll(*)`**: It takes as argument a JSON object with the following property:
  
  - `enable`: (`boolean`) If false, disable the scroll.

### **getNextSibling**

```ts
// 1. Get next sibling of the target feed.
//    • It returns the sibling's ID.
const next1 = feedlistRef.current?.getNextSibling({
  currentFeedId: 'grinning_face' // First emoji
});
console.log('next1 ::', next1);

// 2. Get next sibling of the target feed.
//    • We're using "siblingIndex" to specify the sibling's index.
//    • It returns the sibling's ID.
const next2 = feedlistRef.current?.getNextSibling({
  currentFeedId: 'grinning_face', // First emoji
  siblingIndex: 1
});
console.log('next2 ::', next2);

// 3. Get next siblings of the target feed.
//    • We're using "getRange" to get all feeds
//    • It returns an array containing the siblings IDs.
const next3 = feedlistRef.current?.getNextSibling({
  currentFeedId: 'grinning_face', // First emoji
  siblingIndex: 5,
  getRange: true
});
console.log('next3 ::', JSON.stringify(next3, null, 2));
```

- **`getNextSibling(*)`**: It takes as argument a JSON object with the following properties:
  
  - `currentFeedId`: (`string`) The ID of the target feed.
  
  - `siblingIndex?`: (`number`) The sibling index, starting from 0.
  
  - `getRange?`: (`boolean`) If true, it will return all the feeds within the range. It requires "siblingIndex" to be defined.

It returns:
  
- (`string | string[]`): Sibling ID(s).
  
- (`undefined`): When no sibling found.

```sh 
# log (1)
next1 :: grinning_face_with_big_eyes

# log (2)
next2 :: grinning_face_with_smiling_eyes

# log (3)
next3 :: [
  "grinning_face_with_big_eyes", 
  "grinning_face_with_smiling_eyes",
  "beaming_face_with_smiling_eyes",
  "grinning_squinting_face",
  "grinning_face_with_sweat",
  "rolling_on_the_floor_laughing"
]
```

### **getPrevSibling**

```ts
// 1. Get prev sibling of the target feed.
//    • Here we're using the first emoji as target.
//    • It returns the sibling's ID.
const prev1 = feedlistRef.current?.getPrevSibling({
  currentFeedId: 'upside_down_face' // 10th emoji
});
console.log('prev1 ::', prev1);

// 2. Get prev sibling of the target feed.
//    • We're using "siblingIndex" to specify the sibling's index.
//    • It returns the sibling's ID.
const prev2 = feedlistRef.current?.getPrevSibling({
  currentFeedId: 'upside_down_face', // 10th emoji
  siblingIndex: 1
});
console.log('prev2 ::', prev2);

// 3. Get prev siblings of the target feed.
//    • We're using "getRange" to get all feeds
//    • It returns an array containing the siblings IDs.
const prev3 = feedlistRef.current?.getPrevSibling({
  currentFeedId: 'upside_down_face', // 10th emoji
  siblingIndex: 5,
  getRange: true
});
console.log('prev3 ::', JSON.stringify(prev3, null, 2));
```

- **`getPrevSibling(*)`**: It takes as argument a JSON object with the following properties:
  
  - `currentFeedId`: (`string`) The ID of the target feed.
  
  - `siblingIndex?`: (`number`) The sibling index, starting from 0.
  
  - `getRange?`: (`boolean`) If true, it will return all the feeds within the range. It needs "siblingIndex" to be defined.

It returns:
  
- (`string | string[]`): Sibling ID(s).
  
- (`undefined`): When no sibling found.

```sh 
# log (1)
prev1 :: slightly_smiling_face

# log (2)
prev2 :: face_with_tears_of_joy

# log (3)
prev3 :: [
  "slightly_smiling_face",
  "face_with_tears_of_joy",
  "rolling_on_the_floor_laughing",
  "grinning_face_with_sweat",
  "grinning_squinting_face",
  "beaming_face_with_smiling_eyes"
]
```

### **getRange**

```ts
// 1. Get feeds From index 0 to index 5.
//    • It returns an array containing the feed IDs.
const range1 = feedlistRef.current?.getRange({
  start: 0,
  end: 5
});
console.log('range1 ::', JSON.stringify(range1, null, 2));

// 2. Get feeds From the feed with ID "grinning_face" to the feed at index 5.
//    • It returns an array containing the feed IDs.
const range2 = feedlistRef.current?.getRange({
  start: 'grinning_face', // First emoji
  end: 5
});
console.log('range2 ::', JSON.stringify(range2, null, 2));
```

- **`getRange(*)`**: It takes as argument a JSON object with the following properties:
  
  - `start`: (`string | number`) The ID or index of the starting feed.
  
  - `end`: (`string | number`) The ID or index of the ending feed.

It returns:

- (`string[]`): Feed IDs.

- (`undefined`): When no feed found.

```sh
# log (1)
range1 :: [
  "grinning_face",
  "grinning_face_with_big_eyes",
  "grinning_face_with_smiling_eyes",
  "beaming_face_with_smiling_eyes",
  "grinning_squinting_face",
  "grinning_face_with_sweat"
]

# log (2)
range2 :: [
  "grinning_face",
  "grinning_face_with_big_eyes",
  "grinning_face_with_smiling_eyes",
  "beaming_face_with_smiling_eyes",
  "grinning_squinting_face",
  "grinning_face_with_sweat"
]
```

### **getFeedFromIndex**

```ts
// 1. Get the ID of the 10th feed.
const ten = feedlistRef.current?.getFeedFromIndex({
  index: 10 
});
console.log('ten ::', ten);

// 2. Get the IDs of first and the 10th feeds.
const many = feedlistRef.current?.getFeedFromIndex({
  index: [0, 10, -1]
});
console.log('many ::', many);
```

- **`getFeedFromIndex(*)`**: It takes as argument a JSON object with the following property:

  - `index`: (`number | number[]`) The indexes.

It returns:

- (`string | string[]`): The IDs.

- (`undefined`): When no feed found.

```sh
# log (1)
ten :: "winking_face"

# log (2)
many :: ["grinning_face", "winking_face", undefined]
```

### **updateProps**

```ts
// Make a "HOT" update of the props of the FeedList component.
// • You should always define the orientation first, and it should match the current orientation of the FeedList component.
// • The "orientation" is not an updatable prop, and any other unavailable props are also not updatable.
feedlistRef.current?.updateProps({
  orientation: 'vertical', // Required
  headerComponent: <View style={{ width: '100%', height: 100, backgroundColor: 'red' }} />,
  footerComponent: <View style={{ width: '100%', height: 100, backgroundColor: 'blue' }} />
  // ... more
});
```

- **`updateProps(*)`**: It takes as argument a JSON object with the following properties:

  - `orientation`: (`horizontal | vertical`) The current orientation of the FeedList component.

  - `style?`: (`json`) Custom style.

  - `hideScrollIndicator?`: (`boolean`) If true, hide the scroll indicator.

  - `alwaysResetProps?`: (`boolean`) If false, the hot updates applied will be maintained, even when the component unmounts and mounts again.

  - `headerComponent?`: (`JSX.Element`) A component that will be used as header.

  - `hideHeaderOnScroll?`: (`boolean`) If true, the header will be hidden when scrolling.

  - `footerComponent?`: (`JSX.Element`) A component that will be used as footer.

  - `hideFooterOnScroll?`: (`boolean`) If true, the footer will be hidden when scrolling.

  - `emptyComponent?`: (`JSX.Element`) A component that will be used as placeholder when the list is empty.

  - `loadingComponent?`: (`JSX.Element`) A component that will be used as loading indicator.

  - `onRefresh?`: (`Function`) A sync function that will execute when the user refreshes the list.

  - `onFeedVisible?`: (`Function`) A sync function to get visible feeds.

  - `onHeaderHidden?`: (`Function`) A sync function that will execute when the header is hidden.

  - `onFooterHidden?`: (`Function`) A sync function that will execute when the footer is hidden.

  - `onListEndClose?`: (`Function`) A sync function that will execute when the list end is about to be reached.

  - `onListEndReached?`: (`Function`) A sync function that will execute when the list end is reached.

  - `onError?`: (`Function`) A sync function to catch errors from other callbacks.

### **getVisibleFeeds**

```ts
// Get visible feeds.
const visibles = feedlistRef.current?.getVisibleFeeds();
console.log('visibles ::', visibles);
```

```sh
# log
visibles :: [
  {
    "feedId": "grinning_face",
    "index": 0,
    "x": 0,
    "y": 99,
    "width": 390,
    "height": 60
  },
  {
    "feedId": "grinning_face_with_big_eyes",
    "index": 1,
    "x": 0,
    "y": 159,
    "width": 390,
    "height": 60
  },
  {
    "feedId": "grinning_face_with_smiling_eyes",
    "index": 2,
    "x": 0,
    "y": 219,
    "width": 390,
    "height": 60
  },
  {
    "feedId": "beaming_face_with_smiling_eyes",
    "index": 3,
    "x": 0,
    "y": 279,
    "width": 390,
    "height": 60
  },
  {
    "feedId": "grinning_squinting_face",
    "index": 4,
    "x": 0,
    "y": 339,
    "width": 390,
    "height": 60
  },
  // ... more
]
```

### **isHeaderVisible**

```ts
const isHeaderVisible = feedlistRef.current?.isHeaderVisible();
console.log('isHeaderVisible ::', isHeaderVisible);
```

### **isFooterVisible**

```ts
const isFooterVisible = feedlistRef.current?.isFooterVisible();
console.log('isFooterVisible ::', isFooterVisible);
```

### **clearList**

```ts 
// Remove every feed from the list.
// • It returns void.
feedlistRef.current?.clearList();
```

### **resetProps**

```ts
// Reset props to the original ones.
// • It returns void.
feedlistRef.current?.resetProps();
```

## Author

My name is **Hamet Kévin E. ODOUTAN** (@vinoskey524) and I’ve been doing software development (web, desktop and mobile) since 2017.

I’m not the kind of developer who makes a dumb copy-paste from ChatGPT. No! I like to understand things and know what I’m really doing. 
For me, a real developer should be able to explain every single line of his code.

Don’t ask me which school or university I attended, because I taught myself software engineering using PDFs from **openclassrooms.com**, which was called **siteduzero** when I started.
A sad truth is that you can’t learn coding just by watching videos; you need books!

I’m really passionate about building software, and **I sincerely believe that being a developer is not just a job, but a lifestyle**!

## Other packages

Below are other packages from the same author.

- **[feedlist-react](https://npmjs.com/package/@vinoskey524/feedlist-react)**: A highly efficient and high-performance feeds renderer, designed for React.

<!-- - **[voicify](https://npmjs.com/package/voicify)**: A highly efficient and blazing fast Text-To-Speech (TTS) software. -->

- **[forestdb](https://npmjs.com/package/forestdb)**: An uncomplicated real-time database with encrypted HTTP and WebSocket server-client communication, fast caching, dataflow and state management, a cross-runtime file system manager, and more, working seamlessly on both frontend and backend.

- **[cococity](https://npmjs.com/package/cococity)**: A lightweight and high-performance library that provides regional data and precise GPS-based localization, without relying on external APIs.

- **[illisible](https://npmjs.com/package/illisible)**: A powerful and high-performance cross-runtime encryption software.

- **[panda](https://npmjs.com/package/@vinoskey524/panda)**: Advanced JSON-based state manager for React and React Native (Bare and Expo).

- **[oh-my-json](https://npmjs.com/package/@vinoskey524/oh-my-json)**: The zenith of JSON manipulation.

## Contact Me

Feel free to reach me at [vinoskey524@gmail.com](mailto:vinoskey524@gmail.com). I speak both French and English.

## License

MIT License

Copyright (c) [2025] [Hamet Kévin E. ODOUTAN]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM,
OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


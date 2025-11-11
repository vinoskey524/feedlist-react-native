/*
*
* Feedlist (React Native)
*
* A highly efficient and high-performance feeds renderer, designed for React and React Native (Bare and Expo).
*
* @vinoskey524 • Hamet Kévin E. ODOUTAN • vinoskey524@gmail.com (Author)
*
*/

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, memo } from 'react';
import type { JSX, RefObject } from 'react';
import { View, ScrollView, useWindowDimensions, Animated, RefreshControl, Image, Text } from 'react-native';
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, StyleProp, ViewStyle } from 'react-native';
import { loadingGif } from './gif';

/* ----------------------------------------- Types ----------------------------------------- */

declare const __DEV__: boolean;

/*
* FEEDLIST TYPES 
*/

export type FEED_LIST_PROPS_TYPE<T extends FL_ORIENTATION_TYPE> = T extends 'vertical'
    /* Vertical orientation */
    ? {
        /**
        * The ID of the FeedList.
        * 
        * It must be unique and immutable during all the lifetime of the app.
        * 
        * Please use a "string literal" and not an auto generated ID. (Very important)
        * 
        * For example, you can use the name of the parent component as ID, as two components can't never have the same name.
        * 
        * (string) - [required] 
        */
        id: string,

        /**
        * The orientation of the FeedList.
        * 
        * (vertical | horizontal) - [required]
        */
        orientation: T,

        /**
        * The unique key used to identify each feed.
        * 
        * Here we'll use "id" as primary key.
        * 
        * (string) - [required]
        */
        primaryKey: string,

        /** 
        * A list of feeds.
        *
        * Feeds are lazy loaded, so no matter the size of the list just pass it. 
        *
        * Don't try to send them in chunk.
        *
        * If you don't want to render any feeds yet, just set an empty array.
        *
        * (json[]) - [required]
        */
        feeds: JSON_DEFAULT_TYPE[],

        /** 
        * A function that returns the feeds component.
        *  
        * @param data (json) It's the feed's data.
        *  
        * @param key (string) The unique key to identify each feed.
        * 
        * (Sync Function) - [required]
        */
        feedComponent: (...x: FL_CREATE_COMPONENT_PROP_ARG_TYPE) => JSX.Element,



        /** 
        * Custom style.
        * 
        * (json) - [optional]
        */
        style?: StyleProp<ViewStyle>,

        /** 
        * Number of columns.
        * 
        * Available only when the "orientation" is vertical.
        * 
        * (auto | number) - [optional]
        */
        columns?: FL_COLUMNS_TYPE,

        /** 
        * If true, the scroll indicator is hidden.
        * 
        * The Default value if "false".
        * 
        * (Boolean) - [optional]
        */
        hideScrollIndicator?: boolean,

        /** 
        * If false, the hot updates applied will be maintained, even when the component unmount and mount again.
        * 
        * Default value is "true".
        * 
        * (Boolean) - [optional]
        */
        alwaysResetProps?: boolean,

        /** 
        * If true, the FeedList will resume from the last scroll point, when it unmounts and mounts again. It will also prevent props to be reset
        * even when "alwaysResetProps" is true.
        *
        * Default value is "false".
        * 
        * (Boolean) - [optional]
        */
        resume?: boolean,



        /** 
        * A component that will be used as header.
        * 
        * Its available only when the orientation is "vertical".
        * 
        * (JSX.Element) - [optional]
        * 
        * React Native only 
        */
        headerComponent?: JSX.Element,

        /** 
        * When true, the header is hidden when scrolling down, and dock at the top when scrolling up.
        * 
        * Its available only when the orientation is "vertical".
        * 
        * It requires the presence of "headerComponent".
        * 
        * The Default value if "false".
        * 
        * (Boolean) - [optional]
        * 
        * React Native only
        */
        hideHeaderOnScroll?: boolean,

        /** 
        * A component that will be used as footer.
        * 
        * Its available only when the orientation is "vertical".
        * 
        * (JSX.Element) - [optional]
        * 
        * React Native only
        */
        footerComponent?: JSX.Element,

        /** 
        * When true, the footer is hidden when scrolling down, and dock at the bottom when scrolling up.
        * 
        * Its available only when the orientation is "vertical".
        * 
        * It requires the presence of "footerComponent".
        * 
        * The Default value if "false".
        * 
        * (Boolean) - [optional]
        * 
        * React Native only 
        */
        hideFooterOnScroll?: boolean,

        /** 
        * A component that will be used as placeholder when the list is empty.
        *  
        * (JSX.Element) - [optional]
        */
        emptyComponent?: JSX.Element,

        /** 
        * A component that will be used as loading indicator.
        *  
        * (JSX.Element) - [optional]
        */
        loadingComponent?: JSX.Element,



        /** TODO */
        // onFetch?: () => JSON_DEFAULT_TYPE[] | undefined,

        /** 
        * It fires once every time the user refresh.
        * 
        * (Sync Function) - [optional]
        */
        onRefresh?: () => void,

        /** 
        * It fires once every time a feed become visible or unvisible.
        * 
        * @param id (string) The ID or the of the primary key of the feed.
        * 
        * @param isVisible (boolean) A boolean.
        * 
        * @param rect The offsets and dimensions of the feed.
        * 
        *    - "width": The feed's width in pixel.
        * 
        *    - "height": The feed's height in pixel.
        * 
        *    - "x": The feed's offest left in pixel.
        * 
        *    - "y": The feed's offest top in pixel.
        * 
        * (Sync Function) - [optional]
        */
        onFeedVisible?: (...x: FL_ON_FEED_VISIBLE_ARG_TYPE) => void,

        /** 
        * It fires once every time the header is hidden on scroll.
        * 
        * It requires the presence of "headerComponent" and "hideHeaderOnScroll" to be true.
        * 
        * (Sync Function) - [optional]
        * 
        * React Native only
        */
        onHeaderHidden?: (isHidden: boolean) => void,

        /** 
        * It fires once every time the footer is hidden on scroll.
        * 
        * It requires the presence of "footerComponent" and "hideFooterOnScroll" to be true.
        * 
        * (Sync Function) - [optional]
        * 
        * React Native only
        */
        onFooterHidden?: (isHidden: boolean) => void,

        /** 
        * It fires once every time the list end is about to be reached.
        * 
        * Meaning after the last batch is rendered.
        * 
        * (Sync Function) - [optional]
        */
        onListEndClose?: () => void,

        /**
        * It fires once every time the user reaches the bottom of the list.
        * 
        * (Sync Function) - [optional]
        */
        onListEndReached?: () => void,

        /**
        * It fires once every time an error occur while executing a callback.
        * 
        * @param source (string) The name of the faulty callback.
        * 
        * @param message (string) The error message.
        * 
        * (Sync Function) - [optional but recommended if you're using callbacks]
        */
        onError?: (...x: FL_ON_ERROR_ARG_TYPE) => void
    }
    /* Horizontal orientation */
    : {
        /**
        * The ID of the FeedList.
        * 
        * It must be unique and immutable during all the lifetime of the app.
        *
        * Please use a "string literal" and not an auto generated ID. (Very important)
        *
        * For example, you can use the name of the parent component as ID, as two components can't never have the same name.
        *
        * (string) - [required] 
        */
        id: string,

        /**
        * The orientation of the FeedList.
        * 
        * (vertical | horizontal) - [required]
        */
        orientation: T,

        /**
        * The unique key used to identify each feed.
        * 
        * Here we'll use "id" as primary key.
        * 
        * (string) - [required]
        */
        primaryKey: string,

        /** 
        * A list of feeds.
        *
        * Feeds are lazy loaded, so no matter the size of the list just pass it. 
        *
        * Don't try to send them in chunk.
        *
        * If you don't want to render any feeds yet, just set an empty array.
        *
        * (json[]) - [required]
        */
        feeds: JSON_DEFAULT_TYPE[],

        /** 
        * A function that returns the feeds component.
        *  
        * @param "data": (json) It's the feed's data.
        *  
        * @param "key": (string) The unique key to identify each feed.
        *  
        * (Sync Function) - [required]
        */
        feedComponent: (...x: FL_CREATE_COMPONENT_PROP_ARG_TYPE) => JSX.Element,



        /** 
        * Custom style.
        * 
        * (json) - [optional]
        */
        style?: StyleProp<ViewStyle>,

        /** 
        * If true, the scroll indicator is hidden.
        * 
        * The Default value if "false".
        * 
        * (Boolean) - [optional]
        */
        hideScrollIndicator?: boolean,

        /** 
        * If false, the hot updates applied will be maintained, even when the component unmount and mount again.
        * 
        * Default value is "true".
        * 
        * (Boolean) - [optional]
        */
        alwaysResetProps?: boolean,

        /** 
        * If true, the FeedList will resume from the last scroll point, when it unmounts and mounts again. It will also prevent props to be reset
        * even when "alwaysResetProps" is true.
        *
        * Default value is "false".
        * 
        * (Boolean) - [optional]
        */
        resume?: boolean,

        /** 
        * A component that will be used as placeholder when the list is empty.
        *  
        * (JSX.Element) - [optional]
        */
        emptyComponent?: JSX.Element,



        /** TODO */
        // onFetch?: () => FL_ON_FETCH_RETURN_TYPE,

        /** 
        * It fires once every time the user refresh.
        * 
        * (Sync Function) - [optional]
        */
        onRefresh?: () => void,

        /** 
        * It fires once every time a feed become visible or unvisible.
        * 
        * @param id (string) The ID or the of the primary key of the feed.
        * 
        * @param isVisible (boolean) A boolean.
        * 
        * @param rect The offsets and dimensions of the feed.
        * 
        *    - "width": The feed's width in pixel.
        * 
        *    - "height": The feed's height in pixel.
        * 
        *    - "x": The feed's offest left in pixel.
        * 
        *    - "y": The feed's offest top in pixel.
        * 
        * (Sync Function) - [optional]
        */
        onFeedVisible?: (...x: FL_ON_FEED_VISIBLE_ARG_TYPE) => void,

        /** 
        * It fires once every time the list end is about to be reached.
        * 
        * Meaning after the last batch is rendered.
        * 
        * (Sync Function) - [optional]
        */
        onListEndClose?: () => void,

        /**
        * It fires once every time the user reaches the bottom of the list.
        * 
        * (Sync Function) - [optional]
        */
        onListEndReached?: () => void,

        /**
        * It fires once every time an error occur while executing a callback.
        * 
        * @param source (string) The name of the faulty callback.
        * 
        * @param message (string) The error message.
        * 
        * (Sync Function) - [optional but recommended if you're using callbacks]
        */
        onError?: (...x: FL_ON_ERROR_ARG_TYPE) => void
    };

type FL_ORIENTATION_TYPE = 'vertical' | 'horizontal';

type FL_COLUMNS_TYPE = 'auto' | number;

type FL_ON_FEED_VISIBLE_ARG_TYPE = [id: string, isVisible: boolean, rect: RECT_TYPE];

type FL_ON_FETCH_ARG_TYPE = [idealFeedCount: number];
type FL_ON_FETCH_RETURN_TYPE = JSON_DEFAULT_TYPE[] | undefined;

type FL_ON_ERROR_ARG_TYPE = [source: FL_ON_ERROR_SOURCE_TYPE, message: string];
type FL_ON_ERROR_SOURCE_TYPE = 'onRefresh' | 'onFeedVisible' | 'onFetch' | 'onHeaderHidden' | 'onFooterHidden' | 'onListEndClose' | 'onListEndReached';

/* Public APIs */
export type FL_PUBLIC_APIs_TYPE = {
    renderFeeds: <T extends FL_FEED_RENDERING_POSITION>(x: FL_RENDER_FEEDS_ARG_TYPE<T>) => DONE_UNDEFINED_TYPE,
    updateFeeds: (x: FL_UPDATE_FEEDS_ARG_TYPE) => DONE_UNDEFINED_TYPE,
    removeFeeds: (x: FL_REMOVE_FEEDS_ARG_TYPE) => DONE_UNDEFINED_TYPE,
    restoreFeeds: (x: FL_REMOVE_FEEDS_ARG_TYPE) => DONE_UNDEFINED_TYPE,
    refresh: () => void,
    getVisibleFeeds: <T extends boolean>() => GET_VISIBLE_FEED_RETURN_TYPE<T>,
    scrollTo: (x: FL_SCROLL_TO_TYPE) => void,
    toggleScroll: (x: FL_TOGGLE_SCROLL_ARG_TYPE) => void,
    getNextSibling: <T extends boolean>(x: FL_GET_SIBLING_ARG_TYPE<T>) => FL_GET_SIBLING_RETURN_TYPE<T>,
    getPrevSibling: <T extends boolean>(x: FL_GET_SIBLING_ARG_TYPE<T>) => FL_GET_SIBLING_RETURN_TYPE<T>,
    getRange: (x: FL_GET_RANGE_ARG_TYPE) => FL_GET_RANGE_RETURN_TYPE,
    getFeedFromIndex: (x: FL_GET_FEED_FROM_INDEX_ARG_TYPE) => FL_GET_FEED_FROM_INDEX_RETURN_TYPE,
    updateProps: <T extends FL_ORIENTATION_TYPE>(x: FL_UPDATE_PROPS_ARG_TYPE<T>) => DONE_UNDEFINED_TYPE,
    isHeaderVisible: () => boolean,
    isFooterVisible: () => boolean,
    clearList: () => void,
    resetProps: () => void
};
export type FL_ERROR_SOURCE_TYPE = FL_ON_ERROR_SOURCE_TYPE;

type FL_FEED_RENDERING_POSITION = 'before' | 'after' | 'top' | 'bottom';
type FL_RENDER_FEEDS_ARG_TYPE<T extends FL_FEED_RENDERING_POSITION> =
    T extends 'before' ? { position: T, targetId: string, feeds: JSON_DEFAULT_TYPE[] } :
    T extends 'after' ? { position: T, targetId: string, feeds: JSON_DEFAULT_TYPE[] } :
    T extends 'top' ? { position: T, feeds: JSON_DEFAULT_TYPE[], scrollToTop?: boolean } :
    T extends 'bottom' ? { position: T, feeds: JSON_DEFAULT_TYPE[] } : any;
type FL_UPDATE_FEEDS_ARG_TYPE = { feeds: JSON_DEFAULT_TYPE | JSON_DEFAULT_TYPE[] };
type FL_REMOVE_FEEDS_ARG_TYPE = { feedsId: string | string[] };
type FL_RESTORE_FEEDS_ARG_TYPE = { feedsId: string | string[] };
type FL_TOGGLE_SCROLL_ARG_TYPE = { enable: boolean };
type FL_GET_SIBLING_ARG_TYPE<T extends boolean> = { currentFeedId: string, siblingIndex?: number, getRange?: T };
type FL_GET_SIBLING_RETURN_TYPE<T extends boolean> = T extends true ? string[] | undefined : string | undefined;

type FL_UPDATE_PROPS_ARG_TYPE<T extends FL_ORIENTATION_TYPE> = T extends 'vertical'
    /* Vertical orientation */
    ? {
        /**
        * The orientation of the FeedList.
        * 
        * (vertical | horizontal) - [required]
        */
        orientation: T,



        /** 
        * A function that returns the feeds component.
        *  
        * @param "data": (json) It's the feed's data.
        *  
        * @param "key": (string) The unique key to identify each feed.
        *  
        * (Sync Function) - [required]
        */
        // feedComponent?: (...x: FL_CREATE_COMPONENT_PROP_ARG_TYPE) => JSX.Element,



        /** 
        * Custom style.
        * 
        * (json) - [optional]
        */
        style?: StyleProp<ViewStyle>,

        /** _ */
        // columns: 'auto' | number,

        /** 
        * If true, the scroll indicator is hidden.
        * 
        * The Default value if "false".
        * 
        * (Boolean) - [optional]
        */
        hideScrollIndicator?: boolean,

        /** 
        * If false, the hot updates applied will be maintained, even when the component unmount and mount again.
        * 
        * Default value is "true".
        * 
        * (Boolean) - [optional]
        */
        alwaysResetProps?: boolean,

        /** 
        * If true, the FeedList will resume from the last scroll point, when it unmounts and mounts again. It will also prevent props to be reset
        * even when "alwaysResetProps" is true.
        *
        * Default value is "false".
        * 
        * (Boolean) - [optional]
        */
        resume?: boolean,



        /** 
        * A component that will be used as header.
        * 
        * Its available only when the orientation is "vertical".
        * 
        * (JSX.Element) - [optional]
        * 
        * React Native only 
        */
        headerComponent?: JSX.Element,

        /** 
        * When true, the header is hidden when scrolling down, and dock at the top when scrolling up.
        * 
        * Its available only when the orientation is "vertical".
        * 
        * It requires the presence of "headerComponent".
        * 
        * The Default value if "false".
        * 
        * (Boolean) - [optional]
        * 
        * React Native only
        */
        hideHeaderOnScroll?: boolean,

        /** 
        * A component that will be used as footer.
        * 
        * Its available only when the orientation is "vertical".
        * 
        * (JSX.Element) - [optional]
        * 
        * React Native only
        */
        footerComponent?: JSX.Element,

        /** 
        * When true, the footer is hidden when scrolling down, and dock at the bottom when scrolling up.
        * 
        * Its available only when the orientation is "vertical".
        * 
        * It requires the presence of "footerComponent".
        * 
        * The Default value if "false".
        * 
        * (Boolean) - [optional]
        * 
        * React Native only 
        */
        hideFooterOnScroll?: boolean,

        /** 
        * A component that will be used as placeholder when the list is empty.
        *  
        * (JSX.Element) - [optional]
        */
        emptyComponent?: JSX.Element,

        /** 
        * A component that will be used as loading indicator.
        *  
        * (JSX.Element) - [optional]
        */
        loadingComponent?: JSX.Element,




        /** TODO */
        // onFetch?: () => JSON_DEFAULT_TYPE[] | undefined,

        /** 
        * It fires once every time the user refresh.
        * 
        * (Sync Function) - [optional]
        */
        onRefresh?: () => void,

        /** 
        * It fires once every time a feed become visible or unvisible.
        * 
        * @param id (string) The ID or the of the primary key of the feed.
        * 
        * @param isVisible (boolean) A boolean.
        * 
        * @param rect The offsets and dimensions of the feed.
        * 
        *    - "width": The feed's width in pixel.
        * 
        *    - "height": The feed's height in pixel.
        * 
        *    - "x": The feed's offest left in pixel.
        * 
        *    - "y": The feed's offest top in pixel.
        * 
        * (Sync Function) - [optional]
        */
        onFeedVisible?: (...x: FL_ON_FEED_VISIBLE_ARG_TYPE) => void,

        /** 
        * It fires once every time the header is hidden on scroll.
        * 
        * It requires the presence of "headerComponent" and "hideHeaderOnScroll" to be true.
        * 
        * (Sync Function) - [optional]
        * 
        * React Native only
        */
        onHeaderHidden?: (isHidden: boolean) => void,

        /** 
        * It fires once every time the footer is hidden on scroll.
        * 
        * It requires the presence of "footerComponent" and "hideFooterOnScroll" to be true.
        * 
        * (Sync Function) - [optional]
        * 
        * React Native only
        */
        onFooterHidden?: (isHidden: boolean) => void,

        /** 
        * It fires once every time the list end is about to be reached.
        * 
        * Meaning after the last batch is rendered.
        * 
        * (Sync Function) - [optional]
        */
        onListEndClose?: () => void,

        /**
        * It fires once every time the user reaches the bottom of the list.
        * 
        * (Sync Function) - [optional]
        */
        onListEndReached?: () => void,

        /**
        * It fires once every time an error occur while executing a callback.
        * 
        * @param source (string) The name of the faulty callback.
        * 
        * @param message (string) The error message.
        * 
        * (Sync Function) - [optional but recommended if you're using callbacks]
        */
        onError?: (...x: FL_ON_ERROR_ARG_TYPE) => void
    }
    /* Horizontal orientation */
    : {
        /**
        * The orientation of the FeedList.
        * 
        * (vertical | horizontal) - [required]
        */
        orientation: T,



        /** 
        * A function that returns the feeds component.
        *  
        * @param "data": (json) It's the feed's data.
        *  
        * @param "key": (string) The unique key to identify each feed.
        *  
        * (Sync Function) - [required]
        */
        // feedComponent?: (...x: FL_CREATE_COMPONENT_PROP_ARG_TYPE) => JSX.Element,



        /** 
        * Custom style.
        * 
        * (json) - [optional]
        */
        style?: StyleProp<ViewStyle>,

        /** 
        * If true, the scroll indicator is hidden.
        * 
        * The Default value if "false".
        * 
        * (Boolean) - [optional]
        */
        hideScrollIndicator?: boolean,

        /** 
        * If false, the hot updates applied will be maintained, even when the component unmount and mount again.
        * 
        * Default value is "true".
        * 
        * (Boolean) - [optional]
        */
        alwaysResetProps?: boolean,

        /** 
        * If true, the FeedList will resume from the last scroll point, when it unmounts and mounts again. It will also prevent props to be reset
        * even when "alwaysResetProps" is true.
        *
        * Default value is "false".
        * 
        * (Boolean) - [optional]
        */
        resume?: boolean,



        /** 
        * A component that will be used as placeholder when the list is empty.
        *  
        * (JSX.Element) - [optional]
        */
        emptyComponent?: JSX.Element,



        /** TODO */
        // onFetch?: () => FL_ON_FETCH_RETURN_TYPE,

        /** 
        * It fires once every time the user refresh.
        * 
        * (Sync Function) - [optional]
        */
        onRefresh?: () => void,

        /** 
        * It fires once every time a feed become visible or unvisible.
        * 
        * @param id (string) The ID or the of the primary key of the feed.
        * 
        * @param isVisible (boolean) A boolean.
        * 
        * @param rect The offsets and dimensions of the feed.
        * 
        *    - "width": The feed's width in pixel.
        * 
        *    - "height": The feed's height in pixel.
        * 
        *    - "x": The feed's offest left in pixel.
        * 
        *    - "y": The feed's offest top in pixel.
        * 
        * (Sync Function) - [optional]
        */
        onFeedVisible?: (...x: FL_ON_FEED_VISIBLE_ARG_TYPE) => void,

        /** 
        * It fires once every time the list end is about to be reached.
        * 
        * Meaning after the last batch is rendered.
        * 
        * (Sync Function) - [optional]
        */
        onListEndClose?: () => void,

        /**
        * It fires once every time the user reaches the bottom of the list.
        * 
        * (Sync Function) - [optional]
        */
        onListEndReached?: () => void,

        /**
        * It fires once every time an error occur while executing a callback.
        * 
        * @param source (string) The name of the faulty callback.
        * 
        * @param message (string) The error message.
        * 
        * (Sync Function) - [optional but recommended if you're using callbacks]
        */
        onError?: (...x: FL_ON_ERROR_ARG_TYPE) => void
    };

type FL_GET_RANGE_ARG_TYPE = { start: number | string, end: number | string };
type FL_GET_RANGE_RETURN_TYPE = string[] | undefined;

type FL_GET_FEED_FROM_INDEX_ARG_TYPE = { index: number | number[] };
type FL_GET_FEED_FROM_INDEX_RETURN_TYPE = string | undefined | (string | undefined)[];

type FL_PRIVATE_APIs_TYPE = {
    sessionId: string,
    scaffoldId: string,
    scaffoldRef: RefObject<ScrollView>,
    scrollOffset: RefObject<{ x: 0, y: 0 }>,
    scaffoldDim: RefObject<DIMENSION_TYPE>,
    orientation: FL_ORIENTATION_TYPE,
    primaryKey: string,
    firstBatch: number,
    feedCountPerBatch: RefObject<number>,
    columns: RefObject<FL_COLUMNS_TYPE>,
    scrollDirectionX: RefObject<SCROLL_DIRECTION_X_TYPE>,
    scrollDirectionY: RefObject<SCROLL_DIRECTION_Y_TYPE>,
    isScrolling: RefObject<boolean>,
    headerVisibility: RefObject<boolean>,
    footerVisibility: RefObject<boolean>,
    endReached: RefObject<boolean>,
    firstVisibleFeedId: string | undefined,

    attachScrollEventFunc: <T extends ATTACH_SCROLL_ARG_ACTION_TYPE>(x: ATTACH_SCROLL_EVENT_ARG_TYPE<T>) => void,
    attachHookListenerFunc: <T extends ATTACH_HOOK_LISTENER_ARG_ACTION_TYPE>(x: ATTACH_HOOK_LISTENER_ARG_TYPE<T>) => void

    createFeedComponentFunc: (...x: FL_CREATE_COMPONENT_PROP_ARG_TYPE) => JSX.Element,
    updateFirstLastFeedContainerRefFunc: (x: FL_UPDATE_FIRST_LAST_FC_REF_TYPE) => void,
    setMainSensorRefFunc: (x: FL_SET_MAIN_SENSOR_REF_TYPE) => void,
    updateHookFunc: <T extends HOOKS_NAME_TYPE>(x: { hookName: T, value: UPDATE_HOOK_ARG_VALUE_TYPE<T> }) => void,
    hasReachedListEndFunc: (x: { endReached: boolean }) => void,
    isListInitiallyEmptyFunc: (empty: boolean) => void,
    showLoadingFunc: (x: SHOW_LOADING_TYPE) => void,
    retrackFeedVisibilityFunc: () => void,
    updateUseVisibleFeedsHooksFunc: () => void,
    scrollToFunc: (x: FL_SCROLL_TO_TYPE) => void,

    triggerOnFetchFunc: (...x: FL_ON_FETCH_ARG_TYPE) => FL_ON_FETCH_RETURN_TYPE,
    triggerOnRefreshFunc: () => void,
    triggerOnFeedVisibleFunc: (...x: FL_ON_FEED_VISIBLE_ARG_TYPE) => void,
    triggerOnHeaderHiddenFunc: () => void,
    triggerOnFooterHiddenFunc: () => void,
    triggerOnListEndCloseFunc: () => void,
    triggerOnListEndReachedFunc: () => void,

    renderFeedsFunc: <T extends FL_FEED_RENDERING_POSITION>(x: FL_RENDER_FEEDS_ARG_TYPE<T>) => DONE_UNDEFINED_TYPE,
    getNextSiblingFunc: <T extends boolean>(x: FL_GET_SIBLING_ARG_TYPE<T>) => FL_GET_SIBLING_RETURN_TYPE<T>,
    getPrevSiblingFunc: <T extends boolean>(x: FL_GET_SIBLING_ARG_TYPE<T>) => FL_GET_SIBLING_RETURN_TYPE<T>
    getFeedFromIndexFunc: (x: FL_GET_FEED_FROM_INDEX_ARG_TYPE) => FL_GET_FEED_FROM_INDEX_RETURN_TYPE,
    toggleScrollFunc: (x: FL_TOGGLE_SCROLL_ARG_TYPE) => void
};
type FL_CREATE_COMPONENT_PROP_ARG_TYPE = [data: any, key: string];
type FL_UPDATE_FIRST_LAST_FC_REF_TYPE = { type: 'first' | 'last', currentRef: REF_UNDEFINED_TYPE };
type FL_SET_MAIN_SENSOR_REF_TYPE = { ref: RefObject<SENSOR_PRIVATE_APIs_TYPE | undefined> };

type FL_SCOPE_DATA_TYPE = {
    [scaffoldId: string]: {
        primaryKey: string,
        ref: RefObject<FL_PUBLIC_APIs_TYPE>,
        controllerRef: RefObject<FL_PRIVATE_APIs_TYPE>,
        props: JSON_DEFAULT_TYPE,
        firstVisibleFeedId: string,
        firstMountedFeedId: string,
        removedFeedsId: { [feedId: string]: string },
        cachedFeeds: { primary: JSON_DEFAULT_TYPE[], secondary: JSON_DEFAULT_TYPE[] }
    }
};

type FL_MAP_DATA_TYPE = {
    [scaffoldId: string]: {
        [feedID: string]: {
            id: string,
            sessionId: string,
            index: number,
            data: JSON_DEFAULT_TYPE,
            removed: boolean,
            wrapperRef: RefObject<FW_PRIVATE_APIs_TYPE | undefined>,
            topSubContainerRef: RefObject<FSC_PRIVATE_APIs_TYPE | undefined>,
            bottomSubContainerRef: RefObject<FSC_PRIVATE_APIs_TYPE | undefined>,
            /** If true, means that it's a fake non-renderable feed, which index is used to help sensors to sort feeds */
            isSensorPlaceholder?: boolean,
            sensorId?: string
        }
    }
};

type FL_FEED_ID_DATA_TYPE = {
    [scaffoldId: string]: {
        [feedId: string]: string
    }
};

type FL_VISIBLE_FEEDS_DATA_TYPE = {
    [scaffoldId: string]: {
        [key: string]: FL_VISIBLE_FEEDS_DT_TYPE
    }
};
type FL_VISIBLE_FEEDS_DT_TYPE = {
    feedId: string,
    index: number,
    x: number,
    y: number,
    width: number,
    height: number
};

type FL_HOOK_DATA = {
    [scaffoldId: string]: {
        [hookId: string]: {
            id: string,
            hookIndex: number,
            hookName: HOOKS_NAME_TYPE,
            refreshHook: Function,
            updateHook: <T extends HOOKS_NAME_TYPE>(hookName: T, value: UPDATE_HOOK_ARG_VALUE_TYPE<T>) => void
        }
    }
};

type FL_USE_ON_SCROLL_HOOK_RETURN_TYPE = {
    isScrolling: boolean,
    orientation: FL_ORIENTATION_TYPE,
    // velocity: number,
    scrollDirectionX: SCROLL_DIRECTION_X_TYPE,
    scrollDirectionY: SCROLL_DIRECTION_Y_TYPE
};

type FL_USE_SCROLL_AMOUNT_HOOK_RETURN_TYPE = { prev: number, current: number, endReached: boolean };

type FL_CONTROLLER_REF = { current: FL_PRIVATE_APIs_TYPE };

type FL_SCROLL_TO_TYPE = { to: number | string, animate?: boolean };

/*
* FEED CONTAINER TYPES
*/

type FEED_CONTAINER_PROPS_TYPE = {
    wid?: string,
    controllerRef: FL_CONTROLLER_REF,
    sensorRef?: SENSOR_REF_TYPE,
    feeds?: JSON_DEFAULT_TYPE[],
    firstOrLast?: 'first' | 'last',
    isMainFeedContainer?: boolean,
    position?: 'before' | 'after',
    targetId?: string
};
type FC_PRIVATE_APIs_TYPE = {
    renderFeedsFunc: (x: FC_RENDER_FEED_ARG_TYPE) => FUNCTION_DEFAULT_RETURN_TYPE
};
type FC_RENDER_FEED_ARG_TYPE = { position: 'top' | 'middle' | 'bottom', feeds: JSON_DEFAULT_TYPE[] };

/*
* FEED SUB CONTAINER TYPES
*/

type FEED_SUB_CONTAINER_PROPS_TYPE = {
    wid?: string,
    type: FSC_TYPE_TYPE,
    controllerRef: FL_CONTROLLER_REF,
    sensorRef?: SENSOR_REF_TYPE,
    renderingMode?: RENDERING_MODE_TYPE
};
type FSC_TYPE_TYPE = 'top' | 'middle' | 'bottom';
type FSC_PRIVATE_APIs_TYPE = {
    renderSpaceFunc: () => FUNCTION_DEFAULT_RETURN_TYPE,
    renderFeedsFunc: (x: FSC_RENDER_FEED_ARG_TYPE) => FUNCTION_DEFAULT_RETURN_TYPE,
    renderContainerFunc: (x: FSC_RENDER_CONTAINER_ARG_TYPE) => FUNCTION_DEFAULT_RETURN_TYPE,
};
type FSC_RENDER_FEED_ARG_TYPE = { feeds: JSON_DEFAULT_TYPE[] };
type FSC_RENDER_CONTAINER_ARG_TYPE = {
    firstOrLast: 'first' | 'last' | undefined,
    feeds: JSON_DEFAULT_TYPE[],
    position?: 'before' | 'after',
    targetId?: string
};

/*
* FEED WRAPPER CONTAINER TYPES
*/

type FEED_WRAPPER_PROPS_ARG_TYPE = { wid?: string, controllerRef: FL_CONTROLLER_REF, component: any, feedData: JSON_DEFAULT_TYPE };
type FW_PRIVATE_APIs_TYPE = {
    removed: RefObject<boolean>,
    visible: RefObject<boolean>,
    isInViewport: RefObject<boolean>,
    measure: RefObject<MEASURE_TYPE>,

    trackVisibilityFunc: (x?: FW_TRACK_VISIBILITY_ARG_TYPE) => void,
    updateFeedFunc: (x: FW_UPDATE_FEED_ARG_TYPE) => FUNCTION_DEFAULT_RETURN_TYPE,
    removeFeedFunc: () => FUNCTION_DEFAULT_RETURN_TYPE,
    restoreFeedFunc: () => FUNCTION_DEFAULT_RETURN_TYPE
};
type FW_UPDATE_FEED_ARG_TYPE = { newData: JSON_DEFAULT_TYPE };
type FW_TRACK_VISIBILITY_ARG_TYPE = { retracking: boolean };

/*
* SENSOR TYPES
*/

type SENSOR_DATA_TYPE = {
    [scaffoldId: string]: {
        [sensorId: string]: {
            id: string,
            feeds: JSON_DEFAULT_TYPE[]
        }
    }
};
type TOP_SENSOR_PROPS_TYPE = {
    wid?: string,
    controllerRef: FL_CONTROLLER_REF,
};
type SENSOR_PROPS_TYPE = {
    wid?: string,
    feeds: JSON_DEFAULT_TYPE[],
    controllerRef: FL_CONTROLLER_REF,
    subContainerBottomRef: RefObject<FSC_PRIVATE_APIs_TYPE | undefined>,
    isMainSensor: boolean,
    position?: 'before' | 'after',
    targetId?: string
};
type SENSOR_PRIVATE_APIs_TYPE = {
    setBottomSubContainerRefFunc: (x: SENSOR_SET_BOTTOM_SC_REF_ARG_TYPE) => void,
    setFeedsFunc: (x: { feeds: JSON_DEFAULT_TYPE[] }) => void
};
type SENSOR_REF_TYPE = RefObject<SENSOR_PRIVATE_APIs_TYPE | undefined>;
type SENSOR_SET_BOTTOM_SC_REF_ARG_TYPE = { ref: RefObject<FSC_PRIVATE_APIs_TYPE> };

/*
* LOADING TYPES
*/

type LOADING_TYPES = {
    showFunc: (show: boolean) => void,
    isLoadingFunc: (isLoading: boolean) => void
};

type SHOW_LOADING_TYPE = { position: 'top' | 'bottom', isLoading: boolean, visible?: boolean };


/*
* ATTACH SCROLL EVENT TYPES
*/
type ATTACHED_SCROLL_EVENT_TYPE = {
    sensor: { [eventId: string]: Function },
    wrapper: { [eventId: string]: Function }
};
type ATTACH_SCROLL_EVENT_ARG_TYPE<T extends ATTACH_SCROLL_ARG_ACTION_TYPE> =
    T extends 'attach' ?
    { eventId: string, action: T, type: 'sensor' | 'wrapper', callback: Function } :
    { eventId: string, action: T, type: 'sensor' | 'wrapper' };
type ATTACH_SCROLL_ARG_ACTION_TYPE = 'attach' | 'detach';

/* 
* ATTACH HOOK LISTENER TYPES
*/
type ATTACH_HOOK_LISTENER_ARG_TYPE<T extends ATTACH_HOOK_LISTENER_ARG_ACTION_TYPE> =
    T extends 'attach' ?
    { action: T, hookIndex: number, hookId: string, scaffoldId?: string, hookName: HOOKS_NAME_TYPE, refreshHook: Function, updateHook: Function } :
    { action: T, hookId: string, scaffoldId?: string };
type ATTACH_HOOK_LISTENER_ARG_ACTION_TYPE = 'attach' | 'detach';

/*
* OTHER TYPES
*/

type HOOKS_NAME_TYPE = 'useFeedListRef' | 'useIsMounted' | 'useScrollEvent' |
    'useScrollAmount' | 'useVisibleFeeds' | 'useIsListEndClose' |
    'useIsListEndReached' | 'useIsHeaderVisible' | 'useIsFooterVisible';
type UPDATE_HOOK_ARG_VALUE_TYPE<T extends HOOKS_NAME_TYPE> =
    T extends 'useScrollEvent' ? USE_ON_SCROLL_HOOK_VALUE_TYPE :
    T extends 'useScrollAmount' ? FL_USE_SCROLL_AMOUNT_HOOK_VALUE_TYPE :
    T extends 'useVisibleFeeds' ? FL_VISIBLE_FEEDS_DT_TYPE[] :
    T extends 'useIsMounted' ? boolean :
    T extends 'useIsListEndClose' ? boolean :
    T extends 'useIsListEndReached' ? boolean :
    T extends 'useIsHeaderVisible' ? boolean :
    T extends 'useIsFooterVisible' ? boolean
    : undefined;
type USE_ON_SCROLL_HOOK_VALUE_TYPE = {
    isScrolling: boolean,
    // velocity: number,
    scrollDirectionX: SCROLL_DIRECTION_X_TYPE,
    scrollDirectionY: SCROLL_DIRECTION_Y_TYPE
};
type FL_USE_SCROLL_AMOUNT_HOOK_VALUE_TYPE = { amount: number, endReached: boolean };

type SCROLL_DIRECTION_X_TYPE = 'goin_left' | 'goin_right' | undefined;
type SCROLL_DIRECTION_Y_TYPE = 'goin_up' | 'goin_down' | undefined;

type GET_VISIBLE_FEED_RETURN_TYPE<T extends boolean> =
    T extends true ?
    { feedId: string, index: number, x: number, y: number, width: number, height: number }[] :
    undefined;

type RENDERING_MODE_TYPE = 'space' | 'feeds' | 'container';

type RECT_TYPE = { x: number, y: number, width: number, height: number, pageX?: number, pageY?: number };

type DIMENSION_TYPE = { width: number, height: number };

type OFFSET_TYPE = { x: number, y: number };

type JSON_DEFAULT_TYPE = { [key: string]: any };

type JSON_STRING_TYPE = { [key: string]: string };

type FUNCTION_DEFAULT_RETURN_TYPE = { ok: boolean, log: string, data: any };

type REF_UNDEFINED_TYPE = RefObject<undefined>;

type REF_NULL_TYPE = RefObject<null>;

type REF_ANY_TYPE = RefObject<any>;

type REF_VIEW_TYPE = RefObject<View>;

type MEASURE_TYPE = { x: number, y: number, width: number, height: number, innerX: number, innerY: number };

type DONE_UNDEFINED_TYPE = 'done' | undefined;

/*
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
*/

/* ----------------------------------------- Constants ----------------------------------------- */

const _dev_ = false;
const _default_first_batch_ = 10;
const _default_columns_ = 1;
const _remount_timout_ = 500;

/*
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
*/

/* ----------------------------------------- DATA Logistic ----------------------------------------- */

/** FeedList scope DATA */
const feedListScopeDATA: { current: FL_SCOPE_DATA_TYPE } = { current: {} }

/** Feed map DATA */
const feedMapDATA: { current: FL_MAP_DATA_TYPE } = { current: {} };

/** Feed IDs */
const feedIdDATA: { current: FL_FEED_ID_DATA_TYPE } = { current: {} };

/** Visible feeds DATA */
const visibleFeedsDATA: { current: FL_VISIBLE_FEEDS_DATA_TYPE } = { current: {} };

/** Sensor DATA */
const sensorDATA: { current: SENSOR_DATA_TYPE } = { current: {} };

/** Hook DATA */
const hookDATA: { current: FL_HOOK_DATA } = { current: {} };

/*
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
*/

/* ----------------------------------------- Functions ----------------------------------------- */

/** Log */
const logFunc = (...log: any[]) => { if (_dev_) console.log(...log) };

/** Permanent log */
const plogFunc = (...log: any[]) => { console.log(...log) };

/** Id generator */
const generateIdFunc = (): string => {
    let id = '';
    const val = '0aW9zXe8CrVt1By5NuA46iZ3oEpRmTlYkUjIhOgPfMdQsSqDwFxGcHvJbKnL';
    for (var i = 0; i < 14; i++)
        id += val.charAt(Math.floor(Math.random() * 36));
    return id;
};

/** Check if the app is in development mode */
const isDevFunc = (): boolean => (typeof __DEV__ !== 'undefined') ? __DEV__ : process.env.NODE_ENV === 'development';

/** Delay function execution */
const delayFunc = (ms?: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms || 1));

/** Detect function type "sync/async" */
const getFunctionTypeFunc = (func: Function): 'sync' | 'async' => {
    const isSync = func.constructor.name === 'Function';
    return isSync ? 'sync' : 'async';
};

/** Generate refs */
const generateRefsFunc = (x: { count: number }): REF_ANY_TYPE[] => Array(x.count || 1).fill(undefined).map(() => React.createRef());

/** Get measure */
const getMeasureFunc = (x: { targetRef: REF_VIEW_TYPE }): Promise<any> => {
    const targetRef = x.targetRef;
    const res = new Promise((res, rej) => {
        try {
            if (!targetRef.current)
                throw new Error(`Invalid target ref!`);
            targetRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => res({ x, y, width, height, pageX, pageY }));
        } catch (e: any) { rej(new Error(e.meesage)) }
    });
    return res;
};

/** Get measure in window */
const getMeasureInWindowFunc = (x: { targetRef: REF_VIEW_TYPE }): Promise<any> => {
    const targetRef = x.targetRef;
    const res = new Promise((res, rej) => {
        try {
            if (!targetRef.current)
                throw new Error(`Invalid target ref!`);
            targetRef.current.measureInWindow((x: number, y: number, width: number, height: number) => res({ x, y, width, height }));
        } catch (e: any) { rej(new Error(e.meesage)) }
    });
    return res;
};

/** Prepare hook listener */
const prepareHookListenerFunc = <T extends ATTACH_HOOK_LISTENER_ARG_ACTION_TYPE>(x: ATTACH_HOOK_LISTENER_ARG_TYPE<T>): void => {
    const hookId = x.hookId;
    const action = x.action;
    const scaffoldId = x.scaffoldId!;
    switch (action) {
        case 'attach': {
            if (!hookDATA.current[scaffoldId])
                hookDATA.current[scaffoldId] = {};
            hookDATA.current[scaffoldId][hookId] = {
                id: hookId,
                hookIndex: x.hookIndex,
                hookName: x.hookName,
                refreshHook: x.refreshHook,
                updateHook: x.updateHook as any
            };
        } break;

        case 'detach': { delete hookDATA.current[scaffoldId][hookId] } break;

        default: { };
    };
};

/** Store feed ID */
const storeFeedIdFunc = (x: { feeds: JSON_DEFAULT_TYPE[], scaffoldId: string, pkey: string }) => {
    const feeds = x.feeds;
    const scaffoldId = x.scaffoldId;
    const pkey = x.pkey;
    for (let i = 0; i < feeds.length; i++) {
        const targ = feeds[i];
        const id = targ[pkey];
        feedIdDATA.current[scaffoldId][id] = id;
    }
};

/** Save list state */
const saveFeedListStateFunc = (x: { feedListId: string }) => {
    const scaffoldId = x.feedListId;

    /* Extract feeds */
    const filterFeeds = Object.values(feedMapDATA.current[scaffoldId])
        .filter((e) => !e.isSensorPlaceholder)
        .sort((a, b) => a.index - b.index);

    /* Extract sensor's placeholder */
    const filterPlaceholder = Object.values(feedMapDATA.current[scaffoldId])
        .filter((e) => e.isSensorPlaceholder)
        .sort((a, b) => a.index - b.index);

    /* Get sensors with remaining feeds to render */
    const validSensorTab = Object.values(sensorDATA.current[scaffoldId]).filter((e) => e.feeds.length > 0);
    const vslen = validSensorTab.length;

    /* Extract latest placeholder for each sensor */
    const latestPlaceholdersTab = [];
    if (vslen > 0)
        for (let i = 0; i < vslen; i++) {
            const sid = validSensorTab[i].id;
            const ph = filterPlaceholder
                .filter((e) => e.sensorId === sid)
                .sort((a, b) => a.index - b.index)
                .reverse(); /* Extract current sensor's placeholders */
            latestPlaceholdersTab.push(ph[0]);
        }

    /* Create a new list of feeds */
    const tab = [...filterFeeds, ...latestPlaceholdersTab].sort((a, b) => a.index - b.index);
    const newList = [];
    for (let i = 0; i < tab.length; i++) {
        const target = tab[i];

        /* - */
        if (!target)
            continue;

        /* Push current sensor feeds */
        if (target.isSensorPlaceholder) {
            const sdata = sensorDATA.current[scaffoldId][target.sensorId!].feeds;
            newList.push(...sdata);
            continue;
        }

        /* push current feed */
        newList.push(target.data);
    }

    /* - */
    const primary = feedListScopeDATA.current[scaffoldId].cachedFeeds.primary || [];
    if (primary.length > 0)
        newList.unshift(...primary);

    /* Cache feeds */
    const scopeData = feedListScopeDATA.current[scaffoldId];
    const pk = scopeData.primaryKey;
    const firstVisibleFeedId = scopeData.firstVisibleFeedId;
    const firstVFIdx = newList.findIndex((e) => e[pk] === firstVisibleFeedId);
    feedListScopeDATA.current[scaffoldId].cachedFeeds = {
        primary: newList.splice(0, firstVFIdx),
        secondary: newList
    };

    /* Reset */
    feedMapDATA.current[scaffoldId] = {};
    feedIdDATA.current[scaffoldId] = {};
    visibleFeedsDATA.current[scaffoldId] = {};
};

/*
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
*/

/* ----------------------------------------- FeedList (&Controller) • Component (main) ----------------------------------------- */

const FeedListWidget = forwardRef(<T extends FL_ORIENTATION_TYPE>(props: FEED_LIST_PROPS_TYPE<T>, ref: any) => {
    /* -------------------------- Constants -------------------------- */

    const refresher = useRef(false);
    const [refresh, setRefresh] = useState(refresher.current);

    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;

    const isMounted = useRef(false);
    const render = useRef(false);

    const isDev = isDevFunc();
    const remountingTimer = useRef<any>(null);
    const cleanUpReady = useRef(false);
    const again = useRef(false);
    const [mountAgain, setMountAgain] = useState(again.current);

    const scope = feedListScopeDATA.current[props.id] || undefined;
    const scopeExists = !scope ? false : true;
    const cachedProps =
        scope?.props['alwaysResetProps'] === false ?
            scope.props :
            (props.alwaysResetProps || !scopeExists) ?
                {} :
                scope.props;

    const primaryCachedFeeds = useRef<JSON_DEFAULT_TYPE[]>([]);
    const secondaryCachedFeeds = useRef<JSON_DEFAULT_TYPE[]>([]);
    if (scopeExists) {
        const cachedFeeds = scope.cachedFeeds;
        primaryCachedFeeds.current = cachedFeeds.primary;
        secondaryCachedFeeds.current = cachedFeeds.secondary;
    }

    const wid = useRef(props.id).current;
    const orientation = props.orientation;
    const primaryKey = props.primaryKey;
    /* Using "Shallow copy" so that the use of "splice" won't affect the original array */
    const feeds = useRef<JSON_DEFAULT_TYPE[]>(secondaryCachedFeeds.current.length > 0 ? [...(secondaryCachedFeeds.current)] : [...props.feeds]);
    const feedComponent = props.feedComponent;
    /* - */
    const style = useRef(cachedProps.style || (props as any).style || {});
    const columns = useRef(cachedProps.columns || (props as any).columns || _default_columns_);
    const hideScrollIndicator = useRef(cachedProps.hideScrollIndicator || props.hideScrollIndicator || false);
    const alwaysResetProps = useRef(cachedProps.alwaysResetProps || props.alwaysResetProps || true);
    const resume = useRef(props.resume || false);
    /* - */
    const headerComponent = useRef<JSX.Element | undefined>(cachedProps.headerComponent || (props as any).headerComponent || undefined);
    const hideHeaderOnScroll = useRef(cachedProps.hideHeaderOnScroll || (props as any).hideHeaderOnScroll || false);
    const footerComponent = useRef<JSX.Element | undefined>(cachedProps.footerComponent || (props as any).footerComponent || undefined);
    const hideFooterOnScroll = useRef(cachedProps.hideFooterOnScroll || (props as any).hideFooterOnScroll || false);
    const emptyComponent = useRef<JSX.Element | undefined>((props as any).emptyComponent || undefined);
    const loadingComponent = useRef<JSX.Element | undefined>((props as any).loadingComponent || undefined);
    /* - */
    // const onFetch = useRef(cachedProps.onFetch || props.onFetch || undefined);
    const onRefresh = useRef(cachedProps.onRefresh || props.onRefresh || undefined);
    const onFeedVisible = useRef(cachedProps.onFeedVisible || props.onFeedVisible || undefined);
    const onHeaderHidden = useRef(cachedProps.onHeaderHidden || (props as any).onHeaderHidden || undefined);
    const onFooterHidden = useRef(cachedProps.onFooterHidden || (props as any).onFooterHidden || undefined);
    const onListEndClose = useRef(cachedProps.onListEndClose || props.onListEndClose || undefined);
    const onListEndReached = useRef(cachedProps.onListEndReached || props.onListEndReached || undefined);
    const onError = useRef(cachedProps.onError || props.onError || undefined);

    const sessionId = useRef(generateIdFunc()).current;
    const createFeedComponentFunc = feedComponent;

    const scaffoldId = wid;
    const scaffoldRef = useRef<ScrollView>(null);

    const hasHeader = headerComponent.current !== undefined;
    const hasFooter = footerComponent.current !== undefined;

    const headerRef = useRef<View>(null);
    const headerHeight = useRef(0);
    const isHeaderVisible = useRef(hasHeader);
    const headerSensorRef = useRef<View>(null);

    const footerRef = useRef<View>(null);
    const footerHeight = useRef(0);
    const isFooterVisible = useRef(hasFooter);
    const footerSensorRef = useRef<View>(null);
    const footerBottomOffset = useRef(new Animated.Value(0)).current;

    const shouldWrap = columns.current === 'auto' || columns.current > 1;

    {
        const baseStyle: any = { flex: 1 };
        if (style.current.width || style.current.height)
            delete baseStyle.flex;
        if (style.current.height && !style.current.maxHeight && typeof style.current.height === 'number')
            Object.assign(baseStyle, { maxHeight: style.current.height });
        style.current = Object.assign({ ...style.current }, baseStyle);
    }

    const mainFeedContainerRef = useRef<FC_PRIVATE_APIs_TYPE>(null);
    const mainSensorRef = useRef<SENSOR_PRIVATE_APIs_TYPE | undefined>(null);

    const firstFeedContainerRef = useRef<FC_PRIVATE_APIs_TYPE>(null);
    const lastFeedContainerRef = useRef<FC_PRIVATE_APIs_TYPE>(null);

    const enableScroll = useRef(true);
    const attachedScrollEvents = useRef<ATTACHED_SCROLL_EVENT_TYPE>({ sensor: {}, wrapper: {} });

    const scaffoldDim = useRef<DIMENSION_TYPE>({ width: 0, height: 0 });
    const scrollOffset = useRef<OFFSET_TYPE>({ x: 0, y: 0 });
    const scrollDirectionX = useRef<SCROLL_DIRECTION_X_TYPE>('goin_right');
    const scrollDirectionY = useRef<SCROLL_DIRECTION_Y_TYPE>('goin_down');
    const isScrolling = useRef(false);
    const triggerOnScrollEvent = useRef(true);
    const scrollTimeout = useRef<any>(undefined);

    const endReached = useRef(false);
    const firstBatch = _default_first_batch_;

    const retrackingTimeout = useRef<any>(undefined);
    const firstVisibleFeedId = useRef<string | undefined>(scopeExists ? feedListScopeDATA.current[scaffoldId].firstVisibleFeedId : undefined).current;

    const loadingTopRef = useRef<LOADING_TYPES>(null);
    const loadingBottomRef = useRef<LOADING_TYPES>(null);

    const bottomMargin = useRef(30);

    const isListEmpty = useRef(false);

    /* 
    * TODO :: Make the footer animation smoother.
    */
    // const footerTranslate = scrollY.interpolate({
    //     inputRange: [0, 50],
    //     outputRange: [0, 80],
    //     extrapolate: 'clamp'
    // });


    /* -------------------------- Methods -------------------------- */

    /* Refresh component */
    const refreshFunc = (): void => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* On mount */
    const onMountFunc = (): any => {
        /* - */
        if (isMounted.current) {
            cleanUpReady.current = true;
            return () => onUnmountFunc(); /* Clean up */
        }
        isMounted.current = true;

        /* Prevent double rendering side effects, caused by "Strict Mode" */
        if (isDev && !again.current) {
            again.current = true;
            delayFunc().then(() => {
                remountingTimer.current = setTimeout(() => {
                    if (cleanUpReady.current)
                        return;
                    setMountAgain(again.current);
                }, _remount_timout_);
            });
        }

        /* Init DATA */
        if (!scopeExists) {
            feedListScopeDATA.current[scaffoldId] = {
                primaryKey,
                ref,
                controllerRef: ref,
                props: {},
                firstVisibleFeedId: '',
                firstMountedFeedId: '',
                removedFeedsId: {},
                cachedFeeds: { primary: [], secondary: [] }
            };
            feedMapDATA.current[scaffoldId] = {};
            feedIdDATA.current[scaffoldId] = {};
            visibleFeedsDATA.current[scaffoldId] = {};
            sensorDATA.current[scaffoldId] = {};
            if (!hookDATA.current[scaffoldId])
                hookDATA.current[scaffoldId] = {};
        }

        /* Refresh hooks */
        refreshAttachedHooksFunc();

        /* clean up */
        return isDev ? undefined : () => onUnmountFunc();
    };

    /* 
    * On unmount 
    * CAUTION! "hookDATA" should never be reset no matter what, in order to not lose contact with existing hooks, the next time the component will mount again.
    */
    const onUnmountFunc = (): void => {
        /* Clear timer */
        clearTimeout(remountingTimer.current);

        /* - */
        if (alwaysResetProps.current && !resume.current)
            feedListScopeDATA.current[scaffoldId].props = {};

        /* 
        * Save state 
        * TODO :: Find a solution to use "resume" even when "column" is different from "1".
        */
        if (resume.current && columns.current === 1)
            saveFeedListStateFunc({ feedListId: scaffoldId });
        else {
            feedMapDATA.current[scaffoldId] = {};
            visibleFeedsDATA.current[scaffoldId] = {};
        }

        /* Refresh hooks */
        refreshAttachedHooksFunc();
    };

    /* On layout */
    const onLayoutFunc = (e: LayoutChangeEvent): void => {
        const { x, y, width, height } = e.nativeEvent.layout;
        scaffoldDim.current = { width, height };
        renderMainContainerFunc();
    };

    /* Render "MainFeedContainer" */
    const renderMainContainerFunc = (): void => {
        render.current = true;
        refreshFunc();
    };

    /* Update "first/last" feed container ref */
    const updateFirstLastFeedContainerRefFunc = (x: FL_UPDATE_FIRST_LAST_FC_REF_TYPE): void => {
        switch (x.type) {
            case 'first': { (firstFeedContainerRef as any).current = x.currentRef.current } break;
            case 'last': { (lastFeedContainerRef as any).current = x.currentRef.current } break;
            default: { };
        };
    };

    /* Set main sensor ref */
    const setMainSensorRefFunc = (x: FL_SET_MAIN_SENSOR_REF_TYPE): void => { (mainSensorRef as any).current = x.ref.current };

    /* Check feeds */
    const checkFeedsFunc = (feeds: JSON_DEFAULT_TYPE[]): void => {
        if (!Array.isArray(feeds))
            throw new Error(`"feeds" is not an array.`);
    };

    /* 
    * Toggle Footer visibility 
    * I've intentionally choosed to not use "Reanimated"!
    */
    const toggleFooterVisibilityFunc = (): void => {
        if (!hideFooterOnScroll.current)
            return;
        if (isFooterVisible.current && scrollDirectionY.current === 'goin_down') {
            isFooterVisible.current = false;
            Animated.timing(footerBottomOffset, { toValue: -footerHeight.current, duration: 300, useNativeDriver: false }).start();

        } else if (!isFooterVisible.current && scrollDirectionY.current === 'goin_up') {
            isFooterVisible.current = true;
            Animated.timing(footerBottomOffset, { toValue: 0, duration: 300, useNativeDriver: false }).start();
        }
    };

    /* On "Header" layout */
    const onHeaderLayoutFunc = (e: LayoutChangeEvent): void => {
        const layout = e.nativeEvent.layout;
        headerHeight.current = layout.height;
    };

    /* On "Footer" layout */
    const onFooterLayoutFunc = (e: LayoutChangeEvent): void => {
        const layout = e.nativeEvent.layout;
        footerHeight.current = layout.height;
        delayFunc().then(() => {
            bottomMargin.current = layout.height + 10;
            refreshFunc();
        });
    };

    /* Attach scroll event */
    const attachScrollEventFunc = <T extends ATTACH_SCROLL_ARG_ACTION_TYPE>(x: ATTACH_SCROLL_EVENT_ARG_TYPE<T>): void => {
        const eventId = x.eventId;
        const type = x.type;
        const action = x.action;
        switch (action) {
            case 'attach': { attachedScrollEvents.current[type][eventId] = x.callback } break;
            case 'detach': { delete attachedScrollEvents.current[type][eventId] } break;
            default: { };
        };
    };

    /* Attach hook listener */
    const attachHookListenerFunc = <T extends ATTACH_HOOK_LISTENER_ARG_ACTION_TYPE>(x: ATTACH_HOOK_LISTENER_ARG_TYPE<T>): void => {
        const hookId = x.hookId;
        const action = x.action;
        switch (action) {
            case 'attach': {
                hookDATA.current[scaffoldId][hookId] = {
                    id: hookId,
                    hookIndex: x.hookIndex,
                    hookName: x.hookName,
                    refreshHook: x.refreshHook,
                    updateHook: x.updateHook as any
                };
            } break;

            case 'detach': { delete hookDATA.current[scaffoldId][hookId] } break;

            default: { };
        };
    };

    /* Refresh attached hooks */
    const refreshAttachedHooksFunc = (): void => {
        const hk = hookDATA.current[scaffoldId];
        const tab = Object.values(hk);
        if (tab.length === 0)
            return;
        tab.sort((a, b) => a.hookIndex - b.hookIndex);
        for (let i = 0; i < tab.length; i++)
            delayFunc().then(() => { tab[i].refreshHook() });
    };

    /* Update hook */
    const updateHookFunc = <T extends HOOKS_NAME_TYPE>(x: { hookName: T, value: UPDATE_HOOK_ARG_VALUE_TYPE<T> }): void => {
        const hookName = x.hookName;
        const hookTab = Object.values(hookDATA.current[scaffoldId]).filter((e) => e.hookName === hookName);
        if (hookTab.length === 0)
            return;
        for (let i = 0; i < hookTab.length; i++)
            delayFunc().then(() => { hookTab[i].updateHook(hookName, x.value) });
    };

    /* Get scroll amount in percentage */
    const getScrollAmountFunc = (x: { parentDim: DIMENSION_TYPE, contentDim: DIMENSION_TYPE, contentOffset: OFFSET_TYPE }): number => {
        let perc = 0;
        switch (orientation) {
            case 'horizontal': {
                const pw = x.parentDim.width;
                const cw = x.contentDim.width;
                const cx = x.contentOffset.x;
                if (cw > pw) {
                    const w = cw - pw;
                    perc = (cx * 100) / w;
                }
            } break;

            case 'vertical': {
                const ph = x.parentDim.height;
                const ch = x.contentDim.height;
                const cy = x.contentOffset.y;
                if (ch > ph) {
                    const h = ch - ph;
                    perc = (cy * 100) / h;
                }
            } break;

            default: { };
        };
        perc = (perc > 100) ? 100 : (perc < 0) ? 0 : perc;
        return perc;
    };

    /* Has reached list end */
    const hasReachedListEndFunc = (x: { endReached: boolean }): void => { endReached.current = x.endReached };

    /* - */
    const isListInitiallyEmptyFunc = (empty: boolean): void => {
        isListEmpty.current = empty;
        refreshFunc();
    };

    /* Show loading */
    const showLoadingFunc = (x: SHOW_LOADING_TYPE) => {
        const position = x.position;
        const isLoading = x.isLoading;
        const visible = x.visible;
        switch (position) {
            case 'top': {
                loadingTopRef.current?.isLoadingFunc(isLoading);
                if (visible !== undefined) loadingTopRef.current?.showFunc(visible);
            } break;

            case 'bottom': {
                loadingBottomRef.current?.isLoadingFunc(isLoading);
                if (visible !== undefined) loadingBottomRef.current?.showFunc(visible);
            } break;

            default: { };
        }
    };

    /* Retrack Feed visibility */
    const retrackFeedVisibilityFunc = (): void => {
        try {
            const val = Object.values(feedMapDATA.current[scaffoldId]) || [];
            if (val.length === 0)
                return;

            const tab = val.filter((x) =>
                !x.isSensorPlaceholder &&
                (x.wrapperRef.current)?.removed.current === false &&
                (x.wrapperRef.current)?.visible.current
            ) || []; /* Mounted feeds */

            if (tab.length === 0)
                return;

            /* Set "first" mounted feeds id */
            feedListScopeDATA.current[scaffoldId].firstMountedFeedId = tab[0].id;

            /* Re-track visibility of all mounted feeds */
            for (let i = 0; i < tab.length; i++)
                delayFunc().then(() => {
                    (tab[i].wrapperRef.current)?.trackVisibilityFunc({ retracking: true });
                });

        } catch (e: any) { logFunc('Err :: retrackFeedVisibilityFunc() =>', e.message) }
    };

    /* After re-tracking in-viewport feeds visibility, update "useVisibleFeeds" hooks */
    const updateUseVisibleFeedsHooksFunc = (): void => {
        try {
            clearTimeout(retrackingTimeout.current);
            retrackingTimeout.current = setTimeout(() => {
                const tab = Object.values(visibleFeedsDATA.current[scaffoldId]);
                if (!tab)
                    return;
                feedListScopeDATA.current[scaffoldId].firstVisibleFeedId = tab[0]?.feedId; /* Set first visible (in-viewport) feed's id */
                updateHookFunc({
                    hookName: 'useVisibleFeeds',
                    value: tab.sort((a, b) => a.index - b.index)
                });
            }, 300);

        } catch (e: any) { logFunc(`Err :: updateUseVisibleFeedsHooksFunc() =>`, e.message) }
    };

    /* On scroll */
    const onScrollFunc = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
        try {
            if (!triggerOnScrollEvent.current || isListEmpty.current)
                return;
            triggerOnScrollEvent.current = false;

            clearTimeout(scrollTimeout.current);
            isScrolling.current = true;

            const ev = e.nativeEvent;
            // const velocity = ev.velocity;
            const parentSize = ev.layoutMeasurement;
            const contentSize = ev.contentSize;
            const offset = ev.contentOffset;

            const fx = offset.x;
            const fy = offset.y;

            /* Update scroll direction */
            switch (orientation) {
                case 'horizontal': {
                    scrollDirectionX.current = (fx >= scrollOffset.current.x) ? 'goin_right' : 'goin_left';
                    scrollOffset.current.x = fx;
                } break;

                case 'vertical': {
                    scrollDirectionY.current = (fy >= scrollOffset.current.y) ? 'goin_down' : 'goin_up';
                    scrollOffset.current.y = fy;

                    /* - */
                    delayFunc().then(() => {
                        toggleFooterVisibilityFunc();
                    });

                    /* Set header visibility */
                    if (hasHeader)
                        delayFunc().then(() => {
                            getMeasureInWindowFunc({ targetRef: headerSensorRef as any })
                                .then((rect: any) => {
                                    const visible = (rect.y - 1) > 0;
                                    if (visible !== isHeaderVisible.current) {
                                        isHeaderVisible.current = visible;
                                        triggerOnHeaderHiddenFunc(!visible);
                                        updateHookFunc({ hookName: 'useIsHeaderVisible', value: visible });
                                    }
                                });
                        });

                    /* Set footer visibility */
                    if (hasFooter)
                        delayFunc().then(() => {
                            getMeasureInWindowFunc({ targetRef: footerSensorRef as any })
                                .then((rect: any) => {
                                    const visible = (rect.y + 1) < windowHeight;
                                    if (visible !== isFooterVisible.current) {
                                        isFooterVisible.current = visible;
                                        triggerOnFooterHiddenFunc(!visible);
                                        updateHookFunc({ hookName: 'useIsFooterVisible', value: visible });
                                    }
                                });
                        });
                } break;

                default: { };
            };

            /* Update hooks */
            const updateHookSubFunc = () => {
                delayFunc().then(() => {
                    /* useScrollEvent */
                    updateHookFunc({
                        hookName: 'useScrollEvent',
                        value: {
                            isScrolling: isScrolling.current,
                            // velocity: orientation === 'horizontal' ? velocity?.x || 0 : velocity?.y || 0,
                            scrollDirectionX: orientation === 'horizontal' ? scrollDirectionX.current : undefined,
                            scrollDirectionY: orientation === 'vertical' ? scrollDirectionY.current : undefined
                        }
                    });

                    /* useScrollAmount */
                    updateHookFunc({
                        hookName: 'useScrollAmount',
                        value: {
                            amount: getScrollAmountFunc({ parentDim: parentSize, contentDim: contentSize, contentOffset: offset }),
                            endReached: endReached.current
                        }
                    });
                });
            };
            updateHookSubFunc();

            /* Trigger events */
            const sensorEvents = Object.values(attachedScrollEvents.current.sensor); /* Sensor events */
            const wrapperEvents = Object.values(attachedScrollEvents.current.wrapper); /* Wrapper events */
            const allEvents = [...sensorEvents, ...wrapperEvents]; /* Always "sensorEvents" first */
            for (let i = 0; i < allEvents.length; i++)
                allEvents[i]();

            /* - */
            triggerOnScrollEvent.current = true;
            scrollTimeout.current = setTimeout(() => {
                isScrolling.current = false;
                scrollDirectionX.current = undefined;
                scrollDirectionY.current = undefined;

                /* Update hooks */
                updateHookSubFunc();

                /* Re-track feeds visibility at scroll end */
                delayFunc().then(() => { retrackFeedVisibilityFunc() });
            }, 100);

        } catch (e: any) {
            triggerOnScrollEvent.current = true;
            logFunc(`Err :: onScrollFunc() =>`, e.message);
        }
    };



    /* 
    * Trigger callbacks 
    */

    // /* Trigger "onFetch" */
    // const triggerOnFetchFunc = async (): Promise<FUNCTION_DEFAULT_RETURN_TYPE> => {
    //     let res: FUNCTION_DEFAULT_RETURN_TYPE = { ok: true, log: '', data: undefined };
    //     if (typeof onFetch.current !== 'function') {
    //         res.ok = false; res.log = `No 'onFetch' method provided !`;
    //         return res;
    //     };

    //     try {
    //         const newFeeds = await onFetch.current();
    //         res.data = newFeeds || [];
    //     } catch (e: any) {
    //         res.ok = false; res.log = e.message;
    //         triggerOnErrorFunc({ source: 'onFetch', message: e.message });
    //     }

    //     return res;
    // };

    /* Trigger "onRefresh" */
    const triggerOnRefreshFunc = (): void => {
        if (typeof onRefresh.current !== 'function')
            return;
        if (getFunctionTypeFunc(onRefresh.current) !== 'sync')
            throw new Error(`The "onRefresh" callback is not a sync function!`);
        delayFunc()
            .then(async () => { await onRefresh.current!() })
            .catch((e: any) => { triggerOnErrorFunc({ source: 'onRefresh', message: e.message }) });
    };

    /* Trigger "onFeedVisible" */
    const triggerOnFeedVisibleFunc = (...x: FL_ON_FEED_VISIBLE_ARG_TYPE): void => {
        if (typeof onFeedVisible.current !== 'function')
            return;
        if (getFunctionTypeFunc(onFeedVisible.current) !== 'sync')
            throw new Error(`The "onFeedVisible" callback is not a sync function!`);
        delayFunc()
            .then(async () => { await onFeedVisible.current!(...x) })
            .catch((e: any) => { triggerOnErrorFunc({ source: 'onFeedVisible', message: e.message }) });
    };

    /* Trigger "onHeaderHidden" */
    const triggerOnHeaderHiddenFunc = (isHidden: boolean): void => {
        if (typeof onHeaderHidden.current !== 'function')
            return;
        if (getFunctionTypeFunc(onHeaderHidden.current) !== 'sync')
            throw new Error(`The "onHeaderHidden" callback is not a sync function!`);
        delayFunc()
            .then(async () => { await onHeaderHidden.current!(isHidden) })
            .catch((e: any) => { triggerOnErrorFunc({ source: 'onHeaderHidden', message: e.message }) });
    };

    /* Trigger "onFooterHidden" */
    const triggerOnFooterHiddenFunc = (isHidden: boolean): void => {
        if (typeof onFooterHidden.current !== 'function')
            return;
        if (getFunctionTypeFunc(onFooterHidden.current) !== 'sync')
            throw new Error(`The "onFooterHidden" callback is not a sync function!`);
        delayFunc()
            .then(async () => { await onFooterHidden.current!(isHidden) })
            .catch((e: any) => { triggerOnErrorFunc({ source: 'onFooterHidden', message: e.message }) });
    };

    /* Trigger "onListEndClose" */
    const triggerOnListEndCloseFunc = (): void => {
        if (typeof onListEndClose.current !== 'function')
            return;
        if (getFunctionTypeFunc(onListEndClose.current) !== 'sync')
            throw new Error(`The "onListEndClose" callback is not a sync function!`);
        delayFunc()
            .then(async () => { await onListEndClose.current!() })
            .catch((e: any) => { triggerOnErrorFunc({ source: 'onListEndClose', message: e.message }) });
    };

    /* Trigger "onListEndReached" */
    const triggerOnListEndReachedFunc = (): void => {
        /* Set bottom loading state */
        loadingBottomRef.current?.isLoadingFunc(false);

        /* - */
        if (typeof onListEndReached.current !== 'function')
            return;
        if (getFunctionTypeFunc(onListEndReached.current) !== 'sync')
            throw new Error(`The "onListEndReached" callback is not a sync function!`);
        delayFunc()
            .then(async () => { await onListEndReached.current!() })
            .catch((e: any) => { triggerOnErrorFunc({ source: 'onListEndReached', message: e.message }) });
    };

    /* Trigger "onError" */
    const triggerOnErrorFunc = (x: { source: FL_ON_ERROR_SOURCE_TYPE, message: string }): void => {
        if (typeof onError.current !== 'function')
            return;
        if (getFunctionTypeFunc(onError.current) !== 'sync')
            throw new Error(`The "onError" callback is not a sync function!`);
        delayFunc()
            .then(() => { onError.current!(x.source, x.message) })
            .catch((e: any) => { logFunc(`Err :: onError() =>`, e.message) });
    };



    /* 
    * Public APIs 
    */

    /* Render feeds */
    const renderFeedsFunc = <T extends FL_FEED_RENDERING_POSITION>(x: FL_RENDER_FEEDS_ARG_TYPE<T>): DONE_UNDEFINED_TYPE => {
        let res: DONE_UNDEFINED_TYPE = 'done';
        try {
            const position = x.position;
            const targetId = (x as any).targetId;
            const scrollToTop = (x as any).scrollToTop || false;
            const feedsTab = [...x.feeds];
            checkFeedsFunc(feedsTab);

            /* If there's no feed to render */
            if (feedsTab.length === 0)
                throw new Error(`The list is empty !`);

            /* If the list is empty */
            if (isListEmpty.current) {
                feeds.current = feedsTab;
                isListEmpty.current = false;
                refreshFunc();
                return 'done';
            }

            /* 
            * Prevent feeds duplication 
            * TODO :: Prevent duplications when "resume" is "true".
            */
            const ftab = Object.keys(feedIdDATA.current[scaffoldId]);
            if (!resume.current && ftab.length > 0) {
                const arr = [];

                /* Extract feeds that doesn't exist already */
                for (let i = 0; i < feedsTab.length; i++) {
                    const targ = feedsTab[i];
                    const targetId = targ[primaryKey];
                    if (!ftab.includes(targetId))
                        arr.push(targ);
                }

                /* Update "feedsTab" */
                const k = Object.keys(feedMapDATA.current[scaffoldId]).length;
                if (arr.length === 0 && k > 0)
                    throw new Error(`Feed already exists!`);
                else if (arr.length > 0 && k > 0) {
                    feedsTab.length = 0;
                    feedsTab.push(...arr);
                }
            }

            /* - */
            const noTargetFoundError = `Target "${targetId}" not found.`;
            const unexpectedError = `An unexpected error occured. Impossible to render feeds.`;

            /* - */
            switch (position) {
                case 'before': {
                    const wrapperRef = feedMapDATA.current[scaffoldId][targetId]?.wrapperRef || undefined;
                    if (!wrapperRef || !wrapperRef.current)
                        throw new Error(noTargetFoundError);

                    const topSubContainerRef = feedMapDATA.current[scaffoldId][targetId]?.topSubContainerRef || undefined;
                    if (!topSubContainerRef || !topSubContainerRef.current)
                        throw new Error(unexpectedError);

                    topSubContainerRef.current.renderContainerFunc({ feeds: feedsTab, firstOrLast: undefined, position: position, targetId: targetId });
                } break;

                case 'after': {
                    const wrapperRef = feedMapDATA.current[scaffoldId][targetId]?.wrapperRef || undefined;
                    if (!wrapperRef || !wrapperRef.current)
                        throw new Error(noTargetFoundError);

                    const bottomSubContainerRef = feedMapDATA.current[scaffoldId][targetId]?.bottomSubContainerRef || undefined;
                    if (!bottomSubContainerRef || !bottomSubContainerRef.current)
                        throw new Error(unexpectedError);

                    bottomSubContainerRef.current.renderContainerFunc({ feeds: feedsTab, firstOrLast: undefined, position: position, targetId: targetId });
                } break;

                case 'top': {
                    /* - */
                    const pr = feedListScopeDATA.current[scaffoldId].cachedFeeds.primary || [];
                    feedListScopeDATA.current[scaffoldId].cachedFeeds.primary.push(...feedsTab, ...pr);

                    /* - */
                    if (scrollToTop)
                        setTimeout(() => { scrollToFunc({ to: 0 }) }, 300);
                } break;

                case 'bottom': { mainSensorRef.current?.setFeedsFunc({ feeds: feedsTab }) } break;

                default: { };
            };

        } catch (e: any) {
            plogFunc(`⛔️ Err :: renderFeedsFunc() =>`, e.message);
            res = undefined;
        }
        return res;
    };

    /* Update feeds */
    const updateFeedsFunc = (x: FL_UPDATE_FEEDS_ARG_TYPE): DONE_UNDEFINED_TYPE => {
        let res: DONE_UNDEFINED_TYPE = 'done';
        try {
            const feedsData = Array.isArray(x.feeds) ? x.feeds : [x.feeds];
            checkFeedsFunc(feedsData);
            const flen = feedsData.length;
            for (let i = 0; i < flen; i++) {
                const currentFeedData = feedsData[i];
                const fid = currentFeedData[primaryKey];
                const wrapperRef = feedMapDATA.current[scaffoldId][fid].wrapperRef || undefined;
                if (!wrapperRef || !wrapperRef.current)
                    continue;
                wrapperRef.current.updateFeedFunc({ newData: currentFeedData });
            }

        } catch (e: any) {
            plogFunc(`⛔️ Err :: updateFeedsFunc() =>`, e.message);
            res = undefined;
        }
        return res;
    };

    /* Remove feeds */
    const removeFeedsFunc = (x: FL_REMOVE_FEEDS_ARG_TYPE): DONE_UNDEFINED_TYPE => {
        let res: DONE_UNDEFINED_TYPE = 'done';
        try {
            const feedsId = Array.isArray(x.feedsId) ? x.feedsId : [x.feedsId];
            const flen = feedsId.length;
            for (let i = 0; i < flen; i++) {
                const fid = feedsId[i];
                const wrapperRef = feedMapDATA.current[scaffoldId][fid].wrapperRef || undefined;
                if (!wrapperRef || !wrapperRef.current)
                    continue;
                wrapperRef.current.removeFeedFunc();
            }

        } catch (e: any) {
            plogFunc(`⛔️ Err :: removeFeedsFunc() =>`, e.message);
            res = undefined;
        }
        return res;
    };

    /* Restore feeds */
    const restoreFeedsFunc = (x: FL_RESTORE_FEEDS_ARG_TYPE): DONE_UNDEFINED_TYPE => {
        let res: DONE_UNDEFINED_TYPE = 'done';
        try {
            const feedsId = Array.isArray(x.feedsId) ? x.feedsId : [x.feedsId];
            const flen = feedsId.length;
            for (let i = 0; i < flen; i++) {
                const fid = feedsId[i];
                const wrapperRef = feedMapDATA.current[scaffoldId][fid].wrapperRef ?? undefined;
                if (!wrapperRef || !wrapperRef.current)
                    continue;
                wrapperRef.current.restoreFeedFunc();
            }

        } catch (e: any) {
            plogFunc(`⛔️ Err :: restoreFeedsFunc() =>`, e.message);
            res = undefined;
        }
        return res;
    };

    /* Get visible feeds */
    const getVisibleFeedsFunc = <T extends boolean>(): GET_VISIBLE_FEED_RETURN_TYPE<T> => {
        let res: JSON_DEFAULT_TYPE = { ok: true, log: '', data: undefined };
        try { res.data = Object.values(visibleFeedsDATA.current[scaffoldId]).sort((a, b) => a.index - b.index) }
        catch (e: any) { res.ok = false; res.log = e.message }
        return res.data;
    };

    /* Scroll to */
    const scrollToFunc = (x: FL_SCROLL_TO_TYPE): void => {
        try {
            const to = x.to;
            const animate = x.animate || false;
            const hori = orientation === 'horizontal';
            switch (typeof to) {
                /* Index */
                case 'number': {
                    if (to === 0)
                        scaffoldRef.current?.scrollTo({ x: 0, y: 0, animated: animate });
                    else if (to < 0)
                        scaffoldRef.current?.scrollToEnd({ animated: true });
                    else
                        scaffoldRef.current?.scrollTo({
                            x: hori ? to : 0,
                            y: !hori ? to : 0,
                            animated: animate
                        });
                } break;

                /* FeedId */
                case 'string': {
                    const tfeed = feedMapDATA.current[scaffoldId][to] || undefined;
                    if (!tfeed) return;

                    /* Get feeds's measure */
                    const measure = (tfeed.wrapperRef.current)?.measure.current;
                    if (!measure) return;

                    /* Scroll to the feed's offset */
                    let offset = hori ? measure.innerX : measure.innerY;
                    scaffoldRef.current?.scrollTo({
                        x: hori ? offset : 0,
                        y: !hori ? offset : 0,
                        animated: animate
                    });
                } break;

                /* - */
                default: { };
            };

        } catch (e: any) {
            plogFunc('Err :: scrollToFunc() =>', e.message)
        }
    };

    /* Toggle scroll */
    const toggleScrollFunc = (x: FL_TOGGLE_SCROLL_ARG_TYPE): void => {
        enableScroll.current = x.enable;
        refreshFunc();
    };

    /* Get next sibling */
    const getNextSiblingFunc = <T extends boolean>(x: FL_GET_SIBLING_ARG_TYPE<T>): FL_GET_SIBLING_RETURN_TYPE<T> => {
        try {
            const currentFeedId = x.currentFeedId;
            const siblingIndex = x.siblingIndex || 0;
            const getRange = x.getRange || false;

            const map = feedMapDATA.current[scaffoldId];
            const mval = Object.values(map);

            const currentfeedIndex = map[currentFeedId].index ?? undefined;
            if (currentfeedIndex === undefined)
                return undefined;

            /* Filter and sort */
            const filter = mval.filter((e) =>
                e.index > currentfeedIndex &&
                !e.isSensorPlaceholder &&
                !e.removed
            ).sort((a, b) => a.index - b.index);

            /* Get sibling id */
            let res: any = filter[siblingIndex].id || undefined;
            if (!res)
                return undefined;

            /* Get range */
            if (getRange) {
                const rg = getRangeFunc({ start: filter[0].id, end: res });
                if (!rg)
                    throw new Error(`Invalid range!`);
                res = rg;
            }

            /* - */
            return res;

        } catch (e: any) {
            plogFunc('Err :: getNextSiblingFunc() =>', e.message);
            return undefined;
        }
    };

    /* Get prev sibling */
    const getPrevSiblingFunc = <T extends boolean>(x: FL_GET_SIBLING_ARG_TYPE<T>): FL_GET_SIBLING_RETURN_TYPE<T> => {
        try {
            const currentFeedId = x.currentFeedId;
            const siblingIndex = x.siblingIndex || 0;
            const getRange = x.getRange || false;

            const map = feedMapDATA.current[scaffoldId];
            const mval = Object.values(map);

            const currentfeedIndex = map[currentFeedId].index ?? undefined;
            if (!currentfeedIndex)
                return undefined;

            /* Filter and sort */
            const filter = mval.filter((e) =>
                e.index < currentfeedIndex &&
                !e.isSensorPlaceholder &&
                !e.removed
            ).sort((a, b) => b.index - a.index);

            /* Get sibling id */
            let res: any = filter[siblingIndex].id || undefined;
            if (!res)
                return undefined;

            /* Get range */
            if (getRange) {
                const rg = getRangeFunc({ start: res, end: filter[0].id });
                if (!rg)
                    throw new Error(`Invalid range!`);
                res = rg.reverse();
            }

            /* - */
            return res;

        } catch (e: any) {
            plogFunc('Err :: getPrevSiblingFunc() =>', e.message);
            return undefined;
        }
    };

    /* Get range */
    const getRangeFunc = (x: FL_GET_RANGE_ARG_TYPE): FL_GET_RANGE_RETURN_TYPE => {
        const res: FUNCTION_DEFAULT_RETURN_TYPE = { ok: true, log: '', data: undefined };
        try {
            let start = x.start;
            let end = x.end;

            /* - */
            const map = Object.values(feedMapDATA.current[scaffoldId]);
            const tab = map.filter((e) =>
                !e.isSensorPlaceholder &&
                !e.removed
            ).sort((a, b) => a.index - b.index);
            const tlen = tab.length;

            /* Check start */
            if (typeof start === 'string') {
                const idx = feedMapDATA.current[scaffoldId][start]?.index ?? undefined;
                if (idx === undefined)
                    throw new Error(`No feed found for the "id" givin to "start".`);
                start = idx;
            }
            else if (start > tlen - 1)
                throw new Error(`The "index" (${x.start}) specified at "start", is greater than the range length (${tlen - 1}).`);
            else if (start < 0)
                throw new Error(`Negative index found at "start".`);

            /* Check end */
            if (typeof end === 'string') {
                const idx = feedMapDATA.current[scaffoldId][end]?.index ?? undefined;
                if (idx === undefined)
                    throw new Error(`No feed found for the "id" givin to "end".`);
                end = idx;
            }
            if (end < 0)
                end = tlen - 1;
            if (end < start)
                throw new Error(`Invalid range! The index of the feed at "start" is greater than the index of the feed at "end".`);

            /* Filter and sort */
            const filter = tab.filter((e) => e.index >= start && e.index <= end).sort((a, b) => a.index - b.index);
            const arr = [];
            for (let i = 0; i < filter.length; i++)
                arr.push(filter[i].id);

            /* - */
            res.data = arr;

        } catch (e: any) { res.ok = false; res.log = e.message }
        return res.data;
    };

    /* Get feed from index */
    const getFeedFromIndexFunc = (x: FL_GET_FEED_FROM_INDEX_ARG_TYPE): FL_GET_FEED_FROM_INDEX_RETURN_TYPE => {
        const tab = Array.isArray(x.index) ? x.index : [x.index];
        const res: (string | undefined)[] = [];
        if (tab.length > 0) {
            const map = Object.values(feedMapDATA.current[scaffoldId]);
            const filter = map.filter((e) =>
                !e.isSensorPlaceholder &&
                !e.removed
            ).sort((a, b) => a.index - b.index);

            for (let i = 0; i < tab.length; i++) {
                const idx = tab[i];
                const id = filter[idx]?.id ?? undefined;
                res.push(id);
            }
        }
        return res.length === 1 ? res[0] : res;
    };

    /* Update props */
    const updatePropsFunc = <T extends FL_ORIENTATION_TYPE>(x: FL_UPDATE_PROPS_ARG_TYPE<T>): FUNCTION_DEFAULT_RETURN_TYPE => {
        const res: FUNCTION_DEFAULT_RETURN_TYPE = { ok: true, log: '', data: undefined };
        try {
            /* Check orientation */
            const _orientation = x.orientation;
            if (_orientation !== orientation)
                throw new Error(`Invalid orientation!`);

            /* - */
            let needToRefresh = false;
            const prp = x as any;
            const args: any = {
                feedComponent: prp.feedComponent || undefined,

                style: prp.style || undefined,
                columns: prp.columns || undefined,
                hideScrollIndicator: prp.hideScrollIndicator || undefined,
                alwaysResetProps: prp.alwaysResetProps || undefined,

                headerComponent: prp.headerComponent || undefined,
                hideHeaderOnScroll: prp.hideHeaderOnScroll || undefined,
                footerComponent: prp.footerComponent || undefined,
                hideFooterOnScroll: prp.hideFooterOnScroll || undefined,
                emptyComponent: prp.emptyComponent || undefined,
                loadingComponent: prp.loadingComponent || undefined,

                onRefresh: prp.onRefresh || undefined,
                onFetch: prp.onFetch || undefined,
                onFeedVisible: prp.onFeedVisible || undefined,
                onHeaderHidden: prp.onHeaderHidden || undefined,
                onFooterHidden: prp.onFooterHidden || undefined,
                onListEndClose: prp.onListEndClose || undefined,
                onListEndReached: prp.onListEndReached || undefined,
                onError: prp.onError || undefined
            };

            /* - */
            for (let k in args) {
                const val = args[k];
                if (!val) continue;

                /* Cache updated props */
                feedListScopeDATA.current[scaffoldId]['props'][k] = val;

                /* Apply update */
                switch (k) {
                    case 'style': {
                        const baseStyle: any = { flex: 1 };
                        if (val.width || val.height)
                            delete baseStyle.flex;
                        if (val.height && !val.maxHeight && typeof val.height === 'number')
                            Object.assign(baseStyle, { maxHeight: val.height });
                        style.current = Object.assign({ ...val }, baseStyle);
                        needToRefresh = true;
                    } break;
                    case 'hideScrollIndicator': {
                        hideScrollIndicator.current = val;
                        needToRefresh = true;
                    } break;
                    case 'alwaysResetProps': {
                        alwaysResetProps.current = val;
                    } break;
                    case 'resume': {
                        resume.current = val;
                    } break;


                    case 'headerComponent': {
                        headerComponent.current = val;
                        needToRefresh = true;
                    } break;
                    case 'hideHeaderOnScroll': {
                        hideHeaderOnScroll.current = val;
                        needToRefresh = true;
                    } break;
                    case 'footerComponent': {
                        footerComponent.current = val;
                        needToRefresh = true;
                    } break;
                    case 'hideFooterOnScroll': {
                        hideFooterOnScroll.current = val;
                        needToRefresh = true;
                    } break;
                    case 'emptyComponent': {
                        emptyComponent.current = val;
                        needToRefresh = true;
                    } break;
                    case 'loadingComponent': {
                        loadingComponent.current = val;
                        needToRefresh = true;
                    } break;


                    case 'onRefresh': { onRefresh.current = val } break;
                    case 'onFeedVisible': { onFeedVisible.current = val } break;
                    case 'onHeaderHidden': { onHeaderHidden.current = val } break;
                    case 'onFooterHidden': { onFooterHidden.current = val } break;
                    case 'onListEndClose': { onListEndClose.current = val } break;
                    case 'onListEndReached': { onListEndReached.current = val } break;
                    case 'onError': { onError.current = val } break;


                    default: { };
                };
            }

            /* - */
            if (needToRefresh)
                refreshFunc();

        } catch (e: any) { res.ok = false; res.log = e.message }
        return res.data;
    };

    /* Is Header visible */
    const isHeaderVisibleFunc = (): boolean => isHeaderVisible.current;

    /* Is Footer visible */
    const isFooterVisibleFunc = (): boolean => isFooterVisible.current;

    /* Clear list */
    const clearListFunc = (): void => {
        Object.assign(
            feedListScopeDATA.current[scaffoldId], {
            firstVisibleFeedId: '',
            firstMountedFeedId: '',
            cachedFeeds: { primary: [], secondary: [] }
        });
        feedMapDATA.current[scaffoldId] = {};
        sensorDATA.current[scaffoldId] = {};
        visibleFeedsDATA.current[scaffoldId] = {};
        feeds.current.length = 0;
        isListEmpty.current = true;
        refreshFunc();
    };

    /* Reset props */
    const resetPropsFunc = (): void => {
        if (feedListScopeDATA.current[scaffoldId].props)
            feedListScopeDATA.current[scaffoldId].props = {};
        refreshFunc();
    };


    /* -------------------------- Hooks -------------------------- */

    /* Imperative Handle */
    useImperativeHandle(ref, () => ({
        /* 
        * Constants 
        */
        sessionId: sessionId,
        scaffoldId: scaffoldId,
        scaffoldRef: scaffoldRef,
        scrollOffset: scrollOffset,
        scaffoldDim: scaffoldDim,
        orientation: orientation,
        primaryKey: primaryKey,
        firstBatch: firstBatch,
        columns: columns,
        scrollDirectionX: scrollDirectionX,
        scrollDirectionY: scrollDirectionY,
        isScrolling: isScrolling,
        headerVisibility: isHeaderVisible,
        footerVisibility: isFooterVisible,
        endReached: endReached,
        firstVisibleFeedId: firstVisibleFeedId,

        /* 
        * Methods 
        */

        /* Public APIs */
        renderFeeds: renderFeedsFunc,
        updateFeeds: updateFeedsFunc,
        removeFeeds: removeFeedsFunc,
        restoreFeeds: restoreFeedsFunc,
        refresh: triggerOnRefreshFunc,
        getVisibleFeeds: getVisibleFeedsFunc,
        scrollTo: scrollToFunc,
        toggleScroll: toggleScrollFunc,
        getNextSibling: getNextSiblingFunc,
        getPrevSibling: getPrevSiblingFunc,
        getRange: getRangeFunc,
        getFeedFromIndex: getFeedFromIndexFunc,
        updateProps: updatePropsFunc,
        isHeaderVisible: isHeaderVisibleFunc,
        isFooterVisible: isFooterVisibleFunc,
        clearList: clearListFunc,
        resetProps: resetPropsFunc,

        /* Private APIs */
        scrollToFunc: scrollToFunc,
        attachScrollEventFunc: attachScrollEventFunc,
        attachHookListenerFunc: attachHookListenerFunc,
        createFeedComponentFunc: createFeedComponentFunc,
        updateFirstLastFeedContainerRefFunc: updateFirstLastFeedContainerRefFunc,
        setMainSensorRefFunc: setMainSensorRefFunc,
        updateHookFunc: updateHookFunc,
        hasReachedListEndFunc: hasReachedListEndFunc,
        isListInitiallyEmptyFunc: isListInitiallyEmptyFunc,
        showLoadingFunc: showLoadingFunc,
        retrackFeedVisibilityFunc: retrackFeedVisibilityFunc,
        updateUseVisibleFeedsHooksFunc: updateUseVisibleFeedsHooksFunc,
        //
        // triggerOnFetchFunc: triggerOnFetchFunc,
        triggerOnRefreshFunc: triggerOnRefreshFunc,
        triggerOnFeedVisibleFunc: triggerOnFeedVisibleFunc,
        triggerOnHeaderHiddenFunc: triggerOnHeaderHiddenFunc,
        triggerOnFooterHiddenFunc: triggerOnFooterHiddenFunc,
        triggerOnListEndCloseFunc: triggerOnListEndCloseFunc,
        triggerOnListEndReachedFunc: triggerOnListEndReachedFunc,
        //
        renderFeedsFunc: renderFeedsFunc,
        getNextSiblingFunc: getNextSiblingFunc,
        getPrevSiblingFunc: getPrevSiblingFunc,
        getFeedFromIndexFunc: getFeedFromIndexFunc,
        toggleScrollFunc: toggleScrollFunc
    }), []);

    /* On mount */
    useEffect(onMountFunc, [mountAgain]);

    /* - */
    useEffect(() => {
        if (!render.current)
            return;
        (firstFeedContainerRef as any).current = mainFeedContainerRef.current;
    }, [refresh]);


    /* -------------------------- Component -------------------------- */

    const component = <>
        {orientation === 'horizontal' ?
            <>
                {isListEmpty.current ?
                    <View style={[style.current as StyleProp<ViewStyle>, { justifyContent: 'center', alignItems: 'center' }]}>
                        {!emptyComponent.current ?
                            <Text style={{ color: '#607D8B', fontSize: 14 }}>•••</Text> :
                            emptyComponent.current
                        }
                    </View>
                    :
                    <ScrollView
                        ref={scaffoldRef}
                        style={style.current as StyleProp<ViewStyle>}
                        onLayout={onLayoutFunc}
                        onScroll={onScrollFunc}
                        scrollEnabled={isListEmpty.current ? false : enableScroll.current}
                        nestedScrollEnabled={true}
                        scrollEventThrottle={18}
                        maintainVisibleContentPosition={{ minIndexForVisible: 1 }}
                        /* - */
                        horizontal={true}
                        alwaysBounceHorizontal={true}
                        showsHorizontalScrollIndicator={!hideScrollIndicator.current}
                    >
                        {render.current && <MainFeedContainer ref={mainFeedContainerRef} feeds={feeds.current} controllerRef={ref} isMainFeedContainer={true} />}
                    </ScrollView>
                }
            </>
            :
            <View style={style.current as StyleProp<ViewStyle>}>
                {isListEmpty.current ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {!emptyComponent.current ?
                            <Text style={{ color: '#607D8B', fontSize: 14 }}>•••</Text> :
                            emptyComponent.current
                        }
                    </View>
                    :
                    <ScrollView
                        ref={scaffoldRef}
                        style={{ flex: 1, zIndex: 0 }}
                        onLayout={onLayoutFunc}
                        onScroll={onScrollFunc}
                        scrollEnabled={enableScroll.current}
                        nestedScrollEnabled={true}
                        scrollEventThrottle={18}
                        refreshControl={<RefreshControl refreshing={false} onRefresh={triggerOnRefreshFunc} />}
                        maintainVisibleContentPosition={{ minIndexForVisible: hasHeader ? 3 : 2 }}
                        /* - */
                        scrollsToTop={true}
                        showsVerticalScrollIndicator={!hideScrollIndicator.current}
                        stickyHeaderIndices={hasHeader ? [0] : undefined}
                        stickyHeaderHiddenOnScroll={hasHeader ? hideHeaderOnScroll.current : undefined}
                    >
                        {hasHeader ?
                            <View ref={headerRef} onLayout={onHeaderLayoutFunc}>
                                {headerComponent.current}
                                <View ref={headerSensorRef} style={{ width: 0, height: 0 }} />
                            </View> : <></>
                        }
                        {render.current &&
                            <>
                                {columns.current === 1 ?
                                    <>
                                        <Loading ref={loadingTopRef} visible={false} isLoading={true} customComponent={loadingComponent.current} />
                                        <TopSensor controllerRef={ref} />
                                        <MainFeedContainer ref={mainFeedContainerRef} feeds={feeds.current} controllerRef={ref} isMainFeedContainer={true} />
                                        <Loading ref={loadingBottomRef} visible={true} isLoading={true} customComponent={loadingComponent.current} />
                                        <View style={{ width: 1, height: bottomMargin.current }} />
                                    </>
                                    :
                                    <View style={[{
                                        width: scaffoldDim.current.width,
                                        flexDirection: shouldWrap ? 'row' : 'column',
                                        flexWrap: shouldWrap ? 'wrap' : undefined
                                    }, (columns.current === 'auto') && { justifyContent: 'space-evenly' }]}>
                                        <Loading ref={loadingTopRef} visible={false} isLoading={true} customComponent={loadingComponent.current} />
                                        <TopSensor controllerRef={ref} />
                                        <MainFeedContainer ref={mainFeedContainerRef} feeds={feeds.current} controllerRef={ref} isMainFeedContainer={true} />
                                        <Loading ref={loadingBottomRef} visible={true} isLoading={true} customComponent={loadingComponent.current} />
                                        <View style={{ width: 1, height: bottomMargin.current }} />
                                    </View>
                                }
                            </>
                        }
                    </ScrollView>
                }
                {hasFooter ?
                    <Animated.View ref={footerRef} onLayout={onFooterLayoutFunc} style={{ width: '100%', height: 'auto', position: 'absolute', left: 0, bottom: footerBottomOffset, zIndex: 1 }}>
                        <View ref={footerSensorRef} style={{ width: 0, height: 0 }} />
                        {footerComponent.current}
                    </Animated.View> : <></>
                }
            </View>
        }
    </>;
    return (component);
});
const FeedList = memo(FeedListWidget, () => true);
export default FeedList;

/*
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
*/

/* ----------------------------------------- FeedContainer • Component ----------------------------------------- */

const FeedContainer = forwardRef((props: FEED_CONTAINER_PROPS_TYPE, ref: any) => {
    /* -------------------------- Constants -------------------------- */

    const refresher = useRef(false);
    const [_, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const render = useRef(true);

    const isDev = isDevFunc();
    const remountingTimer = useRef<any>(null);
    const cleanUpReady = useRef(false);
    const again = useRef(false);
    const [mountAgain, setMountAgain] = useState(again.current);

    const wid = useRef(props.wid || generateIdFunc()).current;
    const controllerRef = props.controllerRef;
    const feeds = props.feeds || [];
    const firstOrLast = props.firstOrLast || undefined;
    const isMainFeedContainer = props.isMainFeedContainer || false;
    const position = props.position;
    const targetId = props.targetId;

    const createSensor = !firstOrLast || firstOrLast !== 'last';
    const sensorRef = createSensor ? useRef<SENSOR_PRIVATE_APIs_TYPE>(null) : useRef(props.sensorRef?.current);

    const scaffoldId = controllerRef.current.scaffoldId;

    const subContainerTopRef = useRef<FSC_PRIVATE_APIs_TYPE>(null);
    const subContainerMiddleRef = useRef<FSC_PRIVATE_APIs_TYPE>(null);
    const subContainerBottomRef = useRef<FSC_PRIVATE_APIs_TYPE>(null);


    /* -------------------------- Methods -------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* On mount */
    const onMountFunc = () => {
        /* - */
        if (isMounted.current) {
            cleanUpReady.current = true;
            return () => onUnmountFunc(); /* Clean up */
        }
        isMounted.current = true;

        /* Prevent double rendering side effects, caused by "Strict Mode" */
        if (isDev && !again.current) {
            again.current = true;
            delayFunc().then(() => {
                remountingTimer.current = setTimeout(() => {
                    if (cleanUpReady.current)
                        return;
                    setMountAgain(again.current);
                }, _remount_timout_);
            });
        }

        /* Render feeds directly if the container is not the main container */
        if (!isMainFeedContainer && !createSensor && feeds.length > 0)
            renderFeedsFunc({ position: 'middle', feeds: feeds });

        /* Set the ref of the new first feed container completely at the top of the list */
        if (firstOrLast === 'first')
            controllerRef.current?.updateFirstLastFeedContainerRefFunc({ type: firstOrLast, currentRef: ref });

        /* Update "topSubContainerRef" & "bottomSubContainerRef" for the target feed from which we render feeds "before" or "after" */
        if (position && targetId) {
            switch (position) {
                case 'before': { (feedMapDATA.current[scaffoldId][targetId].topSubContainerRef as any).current = subContainerBottomRef.current } break;
                case 'after': { (feedMapDATA.current[scaffoldId][targetId].bottomSubContainerRef as any).current = subContainerTopRef.current } break;
                default: { };
            };
        }

        /* clean up */
        return isDev ? undefined : () => onUnmountFunc();
    };

    /* On unmount */
    const onUnmountFunc = () => {
        /* Clear timer */
        clearTimeout(remountingTimer.current);
    };



    /* 
    * APIs 
    */

    /* Render feeds */
    const renderFeedsFunc = (x: FC_RENDER_FEED_ARG_TYPE): FUNCTION_DEFAULT_RETURN_TYPE => {
        let res = { ok: true, log: '', data: undefined };
        try {
            const pos = x.position;
            const feeds = x.feeds;
            switch (pos) {
                case 'top': {
                    const rd = subContainerTopRef.current!.renderContainerFunc({ firstOrLast: 'first', feeds: feeds });
                    if (!rd.ok) throw new Error(rd.log);
                } break;

                case 'middle': {
                    const rd = subContainerMiddleRef.current!.renderFeedsFunc({ feeds: feeds });
                    if (!rd.ok) throw new Error(rd.log);
                } break;

                case 'bottom': {
                    const rd = subContainerBottomRef.current!.renderContainerFunc({ firstOrLast: 'last', feeds: feeds });
                    if (!rd.ok) throw new Error(rd.log);
                } break;

                default: { };
            };

        } catch (e: any) { res.ok = false; res.log = e.message }
        return res;
    };


    /* -------------------------- Hooks -------------------------- */

    /* Imperative Handle */
    useImperativeHandle(ref, () => ({
        renderFeedsFunc: renderFeedsFunc
    }), []);

    /* On mount */
    useEffect(onMountFunc, [mountAgain]);


    /* -------------------------- Component -------------------------- */

    const component = <>
        <FeedSubContainer ref={subContainerTopRef} type='top' controllerRef={controllerRef} sensorRef={sensorRef as any} />
        <FeedSubContainer ref={subContainerMiddleRef} type='middle' controllerRef={controllerRef} sensorRef={sensorRef as any} />
        <FeedSubContainer ref={subContainerBottomRef} type='bottom' controllerRef={controllerRef} sensorRef={sensorRef as any} />
        {createSensor && <Sensor ref={sensorRef} feeds={feeds} controllerRef={controllerRef} subContainerBottomRef={subContainerBottomRef as any} isMainSensor={isMainFeedContainer} position={position} targetId={targetId} />}
    </>;
    return (render.current && component);
});

/*
* 
* 
* 
* 
* 
* 
*/

const MainFeedContainer = memo(FeedContainer, () => true);

/*
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
*/

/* ----------------------------------------- FeedSubContainer • Component ----------------------------------------- */

const FeedSubContainerWidget = forwardRef((props: FEED_SUB_CONTAINER_PROPS_TYPE, ref: any) => {
    /* -------------------------- Constants -------------------------- */

    const refresher = useRef(false);
    const [_, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const render = useRef(true);

    const isDev = isDevFunc();
    const remountingTimer = useRef<any>(null);
    const cleanUpReady = useRef(false);
    const again = useRef(false);
    const [mountAgain, setMountAgain] = useState(again.current);

    const wid = useRef(props.wid || generateIdFunc()).current;
    const type = props.type;
    const controllerRef = props.controllerRef;
    const sensorRef = props.sensorRef;
    const rmode = props.renderingMode;

    const renderingMode = useRef<RENDERING_MODE_TYPE>(rmode || 'space');
    const feedComponents = useRef<any[]>([]);

    const feeds = useRef<JSON_DEFAULT_TYPE[]>([]);
    const feedContainerFoL = useRef<'first' | 'last' | undefined>(undefined);
    const feedContainerRef = useRef(undefined);

    const position = useRef<'before' | 'after' | undefined>(undefined);
    const targetId = useRef<string | undefined>(undefined);


    /* -------------------------- Methods -------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* On mount */
    const onMountFunc = () => {
        /* - */
        if (isMounted.current) {
            cleanUpReady.current = true;
            return () => onUnmountFunc(); /* Clean up */
        }
        isMounted.current = true;

        /* Prevent double rendering side effects, caused by "Strict Mode" */
        if (isDev && !again.current) {
            again.current = true;
            delayFunc().then(() => {
                remountingTimer.current = setTimeout(() => {
                    if (cleanUpReady.current)
                        return;
                    setMountAgain(again.current);
                }, _remount_timout_);
            });
        }

        /* - */
        if (type === 'bottom')
            sensorRef?.current?.setBottomSubContainerRefFunc({ ref: ref });

        /* Clean up */
        return isDev ? undefined : () => onUnmountFunc();
    };

    /* On unmount */
    const onUnmountFunc = () => {
        /* Clear timer */
        clearTimeout(remountingTimer.current);
    };



    /* 
    * APIs 
    */

    /* Render space */
    const renderSpaceFunc = (): FUNCTION_DEFAULT_RETURN_TYPE => {
        let res: FUNCTION_DEFAULT_RETURN_TYPE = { ok: true, log: '', data: undefined };
        try {
            renderingMode.current = 'space';
            refreshFunc();

        } catch (e: any) { res.ok = false; res.log = e.message }
        return res;
    };

    /* Render (Generate) feeds */
    const renderFeedsFunc = (x: FSC_RENDER_FEED_ARG_TYPE): FUNCTION_DEFAULT_RETURN_TYPE => {
        let res: FUNCTION_DEFAULT_RETURN_TYPE = { ok: true, log: '', data: undefined };
        try {
            renderingMode.current = 'feeds';
            const feeds = x.feeds;
            const createFeedComponentFunc = controllerRef.current.createFeedComponentFunc;
            for (let i = 0; i < feeds.length; i++) {
                const currentFeed = feeds[i];
                const feedComp = createFeedComponentFunc(currentFeed, generateIdFunc());
                const wref = generateRefsFunc({ count: 1 });
                const wrapperComp = <FeedWrapper ref={wref[0]} key={generateIdFunc()} controllerRef={controllerRef} component={feedComp} feedData={currentFeed} />
                feedComponents.current.push(wrapperComp);
            }
            refreshFunc();

        } catch (e: any) { res.ok = false; res.log = e.message }
        return res;
    };

    /* Render container */
    const renderContainerFunc = (x: FSC_RENDER_CONTAINER_ARG_TYPE): FUNCTION_DEFAULT_RETURN_TYPE => {
        let res: FUNCTION_DEFAULT_RETURN_TYPE = { ok: true, log: '', data: undefined };
        try {
            renderingMode.current = 'container';
            feedContainerFoL.current = x.firstOrLast;
            feeds.current = x.feeds;
            position.current = x.position;
            targetId.current = x.targetId;
            refreshFunc();

        } catch (e: any) { res.ok = false; res.log = e.message }
        return res;
    };


    /* -------------------------- Hooks -------------------------- */

    /* Imperative Handle */
    useImperativeHandle(ref, () => ({
        renderSpaceFunc: renderSpaceFunc,
        renderFeedsFunc: renderFeedsFunc,
        renderContainerFunc: renderContainerFunc
    }), []);

    /* On mount */
    useEffect(onMountFunc, [mountAgain]);


    /* -------------------------- Component -------------------------- */

    const component = <>
        {renderingMode.current === 'space' && <></>}
        {renderingMode.current === 'feeds' && <>{feedComponents.current}</>}
        {renderingMode.current === 'container' && <FeedContainer
            ref={feedContainerRef}
            controllerRef={controllerRef}
            sensorRef={sensorRef}
            feeds={feeds.current}
            firstOrLast={feedContainerFoL.current}
            position={position.current}
            targetId={targetId.current}
        />}
    </>;
    return (render.current && component);
});
const FeedSubContainer = memo(FeedSubContainerWidget, () => true);

/* 
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
*/

/* ----------------------------------------- FeedWrapper • Component ----------------------------------------- */

const FeedWrapper = forwardRef((props: FEED_WRAPPER_PROPS_ARG_TYPE, ref: any) => {
    /* -------------------------- Constants -------------------------- */

    const refresher = useRef(false);
    const [_, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const render = useRef(true);

    const isDev = isDevFunc();
    const remountingTimer = useRef<any>(null);
    const cleanUpReady = useRef(false);
    const again = useRef(false);
    const [mountAgain, setMountAgain] = useState(again.current);

    const wid = useRef(props.wid || generateIdFunc()).current;
    const controllerRef: { current: FL_PRIVATE_APIs_TYPE } = props.controllerRef;
    const feedComponent = useRef(props.component);
    const feedData = props.feedData;

    const winWidth = useWindowDimensions().width;
    const winHeigth = useWindowDimensions().height;

    const scaffoldRect = controllerRef.current.scaffoldDim;
    const windowWidth = useRef(scaffoldRect.current!.width || winWidth);
    const windowHeight = useRef(scaffoldRect.current!.height || winHeigth);

    const scaffoldId = controllerRef.current.scaffoldId;
    const orientation = controllerRef.current.orientation;
    const columns = controllerRef.current.columns.current;

    const columnsIsNumber = typeof columns === 'number';
    const hasMultiColumns = columnsIsNumber && columns > 1;
    const columnWidth = hasMultiColumns ? (windowWidth.current / columns) : 0;

    const scope = feedListScopeDATA.current[scaffoldId] || undefined;

    const pk = controllerRef.current.primaryKey;
    const feedID: string = feedData[pk]; /* Feed's primary key's value */

    const wrapperId = useRef(generateIdFunc()).current;
    const wrapperRef = useRef<View>(null);

    const remove = useRef(false);
    const visible = useRef(true);
    const isInViewport = useRef(false);
    const canTrackVisibility = useRef(true);

    const removedFeedsId = scope?.removedFeedsId || {};
    if (removedFeedsId[feedID]) remove.current = true;

    const feedSubContainerTopRef = useRef<FSC_PRIVATE_APIs_TYPE>(null);
    const feedSubContainerBottomRef = useRef<FSC_PRIVATE_APIs_TYPE>(null);

    const wrapperDim = useRef<{ width: string | number, height: string | number }>({
        width: hasMultiColumns ? columnWidth : 'auto',
        height: 'auto'
    });
    const wrapperMeasure = useRef<MEASURE_TYPE | undefined>(undefined);

    const ww = windowWidth.current * 3;
    const wh = windowHeight.current * 2;


    /* -------------------------- Methods -------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* On mount */
    const onMountFunc = () => {
        /* - */
        if (isMounted.current) {
            cleanUpReady.current = true;
            return () => onUnmountFunc(); /* Clean up */
        }
        isMounted.current = true;

        /* Prevent double rendering side effects, caused by "Strict Mode" */
        if (isDev && !again.current) {
            again.current = true;
            delayFunc().then(() => {
                remountingTimer.current = setTimeout(() => {
                    if (cleanUpReady.current)
                        return;
                    setMountAgain(again.current);
                }, _remount_timout_);
            });
        }

        /* Update map data */
        updateMapDataFunc();

        /* Attach scroll event */
        controllerRef.current?.attachScrollEventFunc({
            eventId: wid,
            type: 'wrapper',
            action: 'attach',
            callback: trackVisibilityFunc
        });

        /* Clean up */
        return isDev ? undefined : () => onUnmountFunc();
    };

    /* On unmount */
    const onUnmountFunc = () => {
        /* Clear timer */
        clearTimeout(remountingTimer.current);

        /* Detach scroll event */
        controllerRef.current?.attachScrollEventFunc({
            eventId: wid,
            type: 'wrapper',
            action: 'detach'
        });
    };

    /* Update map data */
    const updateMapDataFunc = () => {
        try {
            if (feedID)
                Object.assign(feedMapDATA.current[scaffoldId][feedID], {
                    wrapperRef: ref,
                    topSubContainerRef: feedSubContainerTopRef,
                    bottomSubContainerRef: feedSubContainerBottomRef
                });

        } catch (e: any) { logFunc('Err :: updateMapDataFunc() =>', e.message) }
    };

    /* On layout */
    const onLayoutFunc = (e: LayoutChangeEvent) => {
        const { x, y, width, height } = e.nativeEvent.layout;
        wrapperMeasure.current = { x, y, width, height, innerX: x, innerY: y };
        setVisibilityFunc({ top: y, left: x, width, height });
    };

    /* Set feed's visibility */
    const setVisibilityFunc = (x: { top: number, left: number, width: number, height: number }) => {
        try {
            const top = x.top;
            const left = x.left;
            const width = x.width;
            const height = x.height;

            /* Check vertical visibilitty */
            let isVerticallyVisible = false;
            if (top < 0)
                isVerticallyVisible = (height + top) > 0;
            else if (top >= 0)
                isVerticallyVisible = top < windowHeight.current;

            /* Check horizontal visibility */
            let isHorizontallyVisible = false;
            if (left < 0)
                isHorizontallyVisible = (width + left) > 0;
            else if (left >= 0)
                isHorizontallyVisible = left < windowHeight.current;

            /* - */
            const isVisible = orientation === 'horizontal' ? isHorizontallyVisible : isVerticallyVisible;
            isInViewport.current = isVisible;
            if (isVisible)
                visibleFeedsDATA.current[scaffoldId][feedID] = {
                    feedId: feedID,
                    index: feedMapDATA.current[scaffoldId][feedID].index,
                    x: left,
                    y: top,
                    width,
                    height
                };
            else delete visibleFeedsDATA.current[scaffoldId][feedID];

        } catch (e: any) { logFunc('Err :: visibilityFunc() =>', e.message) }
    };

    /* Track visibility */
    const trackVisibilityFunc = (x?: FW_TRACK_VISIBILITY_ARG_TYPE): void => {
        if (!canTrackVisibility.current || remove.current)
            return;
        canTrackVisibility.current = false; /* Disable visibility tracking */
        delayFunc().then(() => {
            getMeasureFunc({ targetRef: wrapperRef as any })
                .then((rect: any) => {
                    const { x, y, width, height, pageX, pageY } = rect;
                    const top = pageY;
                    const left = pageX;

                    /* - */
                    wrapperMeasure.current = { x: left, y: top, width, height: height, innerX: x, innerY: y };
                    setVisibilityFunc({ top, left, width, height });

                    /* - */
                    const hide = (orientation === 'horizontal') ? (left > ww || left < -ww) : (top > wh || top < -wh);
                    const show = (orientation === 'horizontal') ? (left > -ww && left < ww) : (top > -wh && top < wh);

                    /* - */
                    if (hide && visible.current) { /* Hide */
                        visible.current = false;
                        fixWrapperSizeFunc({ fix: true });
                        controllerRef.current?.triggerOnFeedVisibleFunc(feedID, false, { x: left, y: top, width, height });

                    } else if (show && !visible.current) { /* Show */
                        visible.current = true;
                        fixWrapperSizeFunc({ fix: false });
                        controllerRef.current?.triggerOnFeedVisibleFunc(feedID, true, { x: left, y: top, width, height });
                    }
                })
                .catch((e: any) => { logFunc('Err :: trackVisibilityFunc() =>', e.message) })
                .finally(() => {
                    if (x?.retracking && isInViewport.current)
                        controllerRef.current.updateUseVisibleFeedsHooksFunc(); /* Re-track visibility */
                    canTrackVisibility.current = true /* Enable visibility tracking */
                });

        }).catch(() => { canTrackVisibility.current = true });
    };

    /* Fix wrapper size */
    const fixWrapperSizeFunc = (x: { fix: boolean }): void => {
        const fix = x.fix;
        const m = wrapperMeasure.current!;
        wrapperDim.current = {
            width: hasMultiColumns ? columnWidth : !fix ? 'auto' : m.width,
            height: !fix ? 'auto' : m.height
        };
        refreshFunc();
    };



    /* 
    * APIs 
    */

    /* Update feed */
    const updateFeedFunc = (x: FW_UPDATE_FEED_ARG_TYPE): FUNCTION_DEFAULT_RETURN_TYPE => {
        let res = { ok: true, log: '', data: undefined };
        try {
            const newData = x.newData;
            const createFeedComponentFunc = controllerRef.current.createFeedComponentFunc;
            feedComponent.current = createFeedComponentFunc(newData, generateIdFunc());
            refreshFunc();

        } catch (e: any) { res.ok = false; res.log = e.message }
        return res;
    };

    /* Remove feed */
    const removeFeedFunc = (): FUNCTION_DEFAULT_RETURN_TYPE => {
        let res = { ok: true, log: '', data: undefined };
        try {
            remove.current = true;
            feedMapDATA.current[scaffoldId][feedID].removed = true;
            feedListScopeDATA.current[scaffoldId].removedFeedsId[feedID] = feedID;
            delayFunc().then(() => { controllerRef.current.retrackFeedVisibilityFunc() });
            refreshFunc();

        } catch (e: any) { res.ok = false; res.log = e.message }
        return res;
    };

    /* Restore feed */
    const restoreFeedFunc = (): FUNCTION_DEFAULT_RETURN_TYPE => {
        let res = { ok: true, log: '', data: undefined };
        try {
            remove.current = false;
            feedMapDATA.current[scaffoldId][feedID].removed = false;
            delete feedListScopeDATA.current[scaffoldId].removedFeedsId[feedID];
            delayFunc().then(() => { controllerRef.current.retrackFeedVisibilityFunc() });
            refreshFunc();

        } catch (e: any) { res.ok = false; res.log = e.message }
        return res;
    };


    /* -------------------------- Hooks -------------------------- */

    /* Imperative Handle */
    useImperativeHandle(ref, () => ({
        removed: remove,
        visible: visible,
        isInViewport: isInViewport,
        measure: wrapperMeasure,

        /* 
        * Methods 
        */
        trackVisibilityFunc: trackVisibilityFunc,
        updateFeedFunc: updateFeedFunc,
        removeFeedFunc: removeFeedFunc,
        restoreFeedFunc: restoreFeedFunc
    }), []);

    /* On mount */
    useEffect(onMountFunc, [mountAgain]);


    /* -------------------------- Component -------------------------- */

    const component = <>
        <FeedSubContainer ref={feedSubContainerTopRef} type='top' controllerRef={controllerRef} />
        {!remove.current &&
            <View ref={wrapperRef} onLayout={onLayoutFunc} style={wrapperDim.current as StyleProp<ViewStyle>}>
                {visible.current && feedComponent.current}
            </View>
        }
        <FeedSubContainer ref={feedSubContainerBottomRef} type='bottom' controllerRef={controllerRef} />
    </>;
    return (render.current && component);
});

/*
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
*/

/* ----------------------------------------- Sensor • Component ----------------------------------------- */

/* Regular sensor */
const Sensor = forwardRef((props: SENSOR_PROPS_TYPE, ref: any) => {
    /* -------------------------- Constants -------------------------- */

    const refresher = useRef(false);
    const [_, setRefresh] = useState(refresher.current);

    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;

    const isMounted = useRef(false);
    const render = useRef(true);

    const isDev = isDevFunc();
    const remountingTimer = useRef<any>(null);
    const cleanUpReady = useRef(false);
    const again = useRef(false);
    const [mountAgain, setMountAgain] = useState(again.current);

    const wid = useRef(props.wid || generateIdFunc()).current;
    const feeds = useRef(props.feeds.splice(0));
    const controllerRef = props.controllerRef;
    const subContainerBottomRef = useRef(props.subContainerBottomRef);
    const isMainSensor = props.isMainSensor;
    const position = props.position;
    const targetId = props.targetId;

    const sessionId = controllerRef.current.sessionId;

    const scaffoldId = controllerRef.current.scaffoldId;
    const scaffoldHeight = windowHeight;

    const orientation = controllerRef.current.orientation;
    const pk = controllerRef.current.primaryKey;

    const sensorRef = useRef<View>(null);
    const isSensorVisible = useRef(false);
    const shouldRenderFeeds = useRef(false);

    const cancelReqAnimFrame = useRef(false);
    const suspendWatcher = useRef(false);

    const isRenderingMoreFeeds = useRef(false);
    const renderingBatchCount = useRef(0);

    const frameReqRef = useRef<number | undefined>(undefined);

    const latestPlaceholderId = useRef<string | undefined>(undefined);

    const updateUseVisibleFeedsHooks = useRef(true);

    const isListInitiallyEmpty = useRef(false);


    /* -------------------------- Methods -------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* On mount */
    const onMountFunc = () => {
        /* - */
        if (isMounted.current) {
            cleanUpReady.current = true;
            return () => onUnmountFunc(); /* Clean up */
        }
        isMounted.current = true;

        /* Check if list is initially empty */
        checkListIsEmptyFunc();

        /* Prevent double rendering side effects, caused by "Strict Mode" */
        if (isDev && !again.current) {
            again.current = true;
            delayFunc().then(() => {
                remountingTimer.current = setTimeout(() => {
                    if (cleanUpReady.current)
                        return;
                    setMountAgain(again.current);
                }, _remount_timout_);
            });
        }

        /* - */
        controllerRef.current.showLoadingFunc({
            position: 'bottom',
            isLoading: false
        });

        /* Cache sensor's data */
        sensorDATA.current[scaffoldId][wid] = {
            id: wid,
            feeds: feeds.current
        };

        /* Store feed id */
        storeFeedIdFunc({
            feeds: [...feeds.current],
            scaffoldId,
            pkey: pk
        });

        /* watch sensor */
        watchSensorFunc();

        /* - */
        if (isMainSensor)
            controllerRef.current?.setMainSensorRefFunc({ ref: ref });

        /* clean up */
        return isDev ? undefined : () => onUnmountFunc();
    };

    /* On unmount */
    const onUnmountFunc = () => {
        /* Clear timer */
        clearTimeout(remountingTimer.current);

        /* Cancel frame req */
        suspendWatcher.current = true;
        cancelReqAnimFrame.current = true;
    };

    /* Check if list is initially empty */
    const checkListIsEmptyFunc = () => {
        if (!isMainSensor)
            return;
        const empty = feeds.current.length === 0;
        if (!empty)
            return;
        isListInitiallyEmpty.current = true;
        controllerRef.current.isListInitiallyEmptyFunc(true);
    };

    /* Watch sensor */
    const watchSensorFunc = (): void => {
        if (suspendWatcher.current || cancelReqAnimFrame.current)
            return;
        suspendWatcher.current = true; /* Disable watcher */
        delayFunc().then(() => {
            getMeasureInWindowFunc({ targetRef: sensorRef as any })
                .then((rect: any) => {
                    const { x, y, width, height } = rect;
                    const top = y;

                    /* Track sensor visibility */
                    const visible = top >= 0 && top <= windowHeight;
                    const visibility = isSensorVisible.current;
                    if (visible && !isSensorVisible.current)
                        isSensorVisible.current = true;
                    else if (!visible && isSensorVisible.current)
                        isSensorVisible.current = false;
                    if (visibility !== isSensorVisible.current)
                        onVisibleFunc({ isVisible: isSensorVisible.current });

                    /* Render more feeds */
                    const renderMore = (top - scaffoldHeight) < scaffoldHeight && feeds.current.length > 0;
                    const rdm = shouldRenderFeeds.current;
                    if (renderMore && !shouldRenderFeeds.current)
                        shouldRenderFeeds.current = true;
                    else if (!renderMore && shouldRenderFeeds.current)
                        shouldRenderFeeds.current = false;
                    if (rdm !== shouldRenderFeeds.current)
                        renderMoreFeedsFunc();

                })
                .catch((e: any) => { logFunc('Err :: watchSensorFunc() =>', e.message) })
                .finally(() => {
                    if (frameReqRef.current)
                        cancelAnimationFrame(frameReqRef.current);
                    if (shouldRenderFeeds.current) {
                        /* Detach sensor from scroll event */
                        controllerRef.current?.attachScrollEventFunc({
                            eventId: wid,
                            type: 'sensor',
                            action: 'detach'
                        });

                        /* Request new frame update */
                        frameReqRef.current = requestAnimationFrame(watchSensorFunc);

                    } else {
                        /* - */
                        frameReqRef.current = undefined;

                        /* Attach sensor to scroll event */
                        controllerRef.current?.attachScrollEventFunc({
                            eventId: wid,
                            type: 'sensor',
                            action: 'attach',
                            callback: watchSensorFunc
                        });

                        /* Update "useVisibleFeeds" hooks, only after initial rendering from the main sensor */
                        if (isMainSensor && updateUseVisibleFeedsHooks.current) {
                            updateUseVisibleFeedsHooks.current = false;
                            (controllerRef.current.scaffoldRef).current?.scrollTo({ x: 1, y: 1, animated: false });
                        }
                    }

                    /* - */
                    if (isMainSensor && feeds.current.length === 0)
                        controllerRef.current.showLoadingFunc({
                            position: 'bottom',
                            isLoading: false
                        });

                    /* Detach non-main sensor from scroll event, once it has finished to render all its feeds */
                    if (!isMainSensor && feeds.current.length === 0)
                        controllerRef.current?.attachScrollEventFunc({
                            eventId: wid,
                            type: 'sensor',
                            action: 'detach'
                        });

                    /* Very important • Determine and Stabilize rendering cycle */
                    renderingBatchCount.current += 1;
                    isRenderingMoreFeeds.current = false;
                    shouldRenderFeeds.current = false;

                    /* Enable watcher • Should always come LAST */
                    suspendWatcher.current = false;
                });

        }).catch(() => { suspendWatcher.current = false });
    };

    /* On visible */
    const onVisibleFunc = (x: { isVisible: boolean }) => {
        const isVisible = x.isVisible;
        const emptyList = !isListInitiallyEmpty.current && feeds.current.length === 0;
        if (!isVisible || !emptyList) {
            if (controllerRef.current.endReached.current) {
                controllerRef.current.hasReachedListEndFunc({ endReached: false });
                controllerRef.current?.updateHookFunc({ hookName: 'useIsListEndReached', value: false });
            }
            return;
        }

        if (isMainSensor) {
            controllerRef.current?.hasReachedListEndFunc({ endReached: true });
            controllerRef.current?.updateHookFunc({ hookName: 'useIsListEndReached', value: true });
            controllerRef.current?.triggerOnListEndReachedFunc();
        }
        else if (!isMainSensor) cancelReqAnimFrame.current = true;
    };

    /* Render more feeds */
    const renderMoreFeedsFunc = () => {
        if (isRenderingMoreFeeds.current || feeds.current.length === 0)
            return;
        try {
            isRenderingMoreFeeds.current = true;

            const firstBatch = controllerRef.current.firstBatch;
            const batch = (renderingBatchCount.current >= 2) ? firstBatch * 2 : firstBatch;

            const feedsArr = feeds.current.splice(0, batch);
            const flen = feedsArr.length;

            const map = feedMapDATA.current[scaffoldId];
            const mtab = Object.values(map);

            /* Set bottom loading state */
            if (isMainSensor)
                controllerRef.current.showLoadingFunc({
                    position: 'bottom',
                    isLoading: true
                });

            /*
            * Add new feeds to the map and update indexes 
            */

            /* 0. Get the latest placeholder's index */
            const latestPlaceholderIndex = !latestPlaceholderId.current ?
                undefined :
                feedMapDATA.current[scaffoldId][latestPlaceholderId.current].index || undefined;
            if (latestPlaceholderId.current && !latestPlaceholderIndex)
                throw new Error(`Invalid placeholder index!`);

            /* 1. Update the indexes of existing feeds, coming after new feeds, starting from current target */
            let idx = 0;
            if (targetId) {
                if (!position)
                    throw new Error(`Invalid "position"!`);

                /* Get target's index */
                let targetIndex = mtab.filter((e) => e.id === targetId)[0]?.index ?? undefined;
                if (targetIndex === undefined)
                    throw new Error(`Invalid "index"!`);

                /* - */
                idx = (renderingBatchCount.current === 0) ?
                    targetIndex + (position === 'before' ? 0 : 1) :
                    latestPlaceholderIndex! + 1; /* The "+1" prevent updating the current placeholder by selecing the next feed • Same above when position is "after" */

                /* - */
                const tb = mtab.filter((e) => e.index >= idx);
                if (tb.length > 0)
                    for (let k = 0; k < tb.length; k++)
                        tb[k].index += (flen + 1); /* The "+1" is for the sensor's placholder */

            } else {
                idx = (renderingBatchCount.current === 0) ? 0 : latestPlaceholderIndex! + 1;
                if (!isMainSensor)
                    for (let k = 0; k < mtab.length; k++)
                        mtab[k].index += (flen + 1); /* The "+1" is for the sensor's placholder */
            }

            /* 2. Add new feeds to the map */
            for (let i = 0; i < flen; i++) {
                const feedData = feedsArr[i];
                const feedID: string = feedData[pk];
                if (!feedID)
                    throw new Error(`Primary key "${pk}" not found!`);
                feedMapDATA.current[scaffoldId][feedID] = {
                    id: feedID,
                    sessionId: sessionId,
                    index: idx + i,
                    data: feedData,
                    removed: false,
                    wrapperRef: { current: undefined },
                    topSubContainerRef: { current: undefined },
                    bottomSubContainerRef: { current: undefined }
                };
            }

            /* 3. Add the sensor's placeholder to the map */
            const placeholderId = generateIdFunc();
            feedMapDATA.current[scaffoldId][placeholderId] = {
                id: placeholderId,
                sessionId: sessionId,
                index: idx + flen,
                data: {},
                removed: false,
                wrapperRef: { current: undefined },
                topSubContainerRef: { current: undefined },
                bottomSubContainerRef: { current: undefined },
                /* - */
                isSensorPlaceholder: true,
                sensorId: wid
            };
            latestPlaceholderId.current = placeholderId; /* Update "latestPlaceholderId" */


            /* Render feeds */
            (subContainerBottomRef.current).current?.renderContainerFunc({ feeds: feedsArr, firstOrLast: 'last', position, targetId });


            /* 
            * Trigger "onListEndClose" 
            * TODO :: Trigger "onListEndClose" when all feeds from all sensors are less than "firstBatch". 
            *      :: It shouldn't be limited to "isMainSensor" only. (Remove "&& isMainSensor")
            */
            const close = feeds.current.length <= firstBatch;
            if (close && isMainSensor)
                delayFunc()
                    .then(() => {
                        controllerRef.current.triggerOnListEndCloseFunc();
                    });

        } catch (e: any) { logFunc('err :: renderMoreFeedsFunc() =>', e.message) }
    };

    /* Set feeds (MainSensor ONLY) */
    const setFeedsFunc = (x: { feeds: JSON_DEFAULT_TYPE[] }) => {
        try {
            const feedsTab = x.feeds;
            if (!Array.isArray(feedsTab))
                throw new Error(`Not an array!`);
            if (feedsTab.length === 0)
                return;
            feeds.current.push(...feedsTab);
            requestAnimationFrame(watchSensorFunc);

        } catch (e: any) { logFunc('Err :: setFeedsFunc() =>', e.message) }
    };

    /* Set bottom sub container ref */
    const setBottomSubContainerRefFunc = (x: SENSOR_SET_BOTTOM_SC_REF_ARG_TYPE) => { subContainerBottomRef.current = x.ref };


    /* -------------------------- Hooks -------------------------- */

    /* Imperative Handle */
    useImperativeHandle(ref, () => ({
        setBottomSubContainerRefFunc: setBottomSubContainerRefFunc,
        setFeedsFunc: setFeedsFunc
    }), []);

    /* On mount */
    useEffect(onMountFunc, [mountAgain]);


    /* -------------------------- Component -------------------------- */

    const component = <View ref={sensorRef} style={{ width: 0, height: 0 }} />;
    return (render.current && component);
});

/* 
* 
* 
* 
* 
* 
* 
*/

/**
* Top sensor
* Used exclusively to render feeds at the top of the list.
*/
const TopSensor = forwardRef((props: TOP_SENSOR_PROPS_TYPE, ref: any) => {
    /* -------------------------- Constants -------------------------- */

    const refresher = useRef(false);
    const [_, setRefresh] = useState(refresher.current);

    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;

    const isMounted = useRef(false);
    const render = useRef(true);

    const isDev = isDevFunc();
    const remountingTimer = useRef<any>(null);
    const cleanUpReady = useRef(false);
    const again = useRef(false);
    const [mountAgain, setMountAgain] = useState(again.current);

    const wid = useRef(props.wid || generateIdFunc()).current;
    const controllerRef = props.controllerRef;

    const sessionId = controllerRef.current.sessionId;
    const scaffoldId = controllerRef.current.scaffoldId;
    const scaffoldHeight = windowHeight;

    const orientation = controllerRef.current.orientation;
    const pk = controllerRef.current.primaryKey;

    // const feeds = useRef<JSON_DEFAULT_TYPE[]>((feedListScopeDATA.current[scaffoldId]?.cachedFeeds.primary).splice(0) || []);
    const feeds = useRef<JSON_DEFAULT_TYPE[]>(feedListScopeDATA.current[scaffoldId]?.cachedFeeds.primary || []);

    const sensorRef = useRef<View>(null);
    const shouldRenderFeeds = useRef(false);

    const cancelReqAnimFrame = useRef(false);
    const suspendWatcher = useRef(false);

    const isRenderingMoreFeeds = useRef(false);
    const renderingBatchCount = useRef(0);

    const frameReqRef = useRef<number | undefined>(undefined);
    const timer = useRef<any>(null);


    /* -------------------------- Methods -------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* On mount */
    const onMountFunc = () => {
        /* - */
        if (isMounted.current) {
            cleanUpReady.current = true;
            return () => onUnmountFunc(); /* Clean up */
        }
        isMounted.current = true;

        /* Prevent double rendering side effects, caused by "Strict Mode" */
        if (isDev && !again.current) {
            again.current = true;
            delayFunc().then(() => {
                remountingTimer.current = setTimeout(() => {
                    if (cleanUpReady.current)
                        return;
                    setMountAgain(again.current);
                }, _remount_timout_);
            });
        }

        /* Cache sensor's data */
        sensorDATA.current[scaffoldId][wid] = {
            id: wid,
            feeds: feeds.current
        };

        /* Store feed id */
        storeFeedIdFunc({
            feeds: [...feeds.current],
            scaffoldId,
            pkey: pk
        });

        /* watch sensor */
        timer.current = setTimeout(() => { watchSensorFunc() }, 2000);

        /* Clean up */
        return isDev ? undefined : () => onUnmountFunc();
    };

    /* On unmount */
    const onUnmountFunc = () => {
        /* Clear timer */
        clearTimeout(remountingTimer.current);
        clearTimeout(timer.current);

        /* Cancel frame req */
        suspendWatcher.current = true;
        cancelReqAnimFrame.current = true;
    };

    /* Watch sensor */
    const watchSensorFunc = (): void => {
        if (suspendWatcher.current || cancelReqAnimFrame.current)
            return;
        suspendWatcher.current = true; /* Disable watcher */
        delayFunc().then(() => {
            getMeasureInWindowFunc({ targetRef: sensorRef as any })
                .then((rect: any) => {
                    const { x, y, width, height } = rect;
                    const top = y;

                    /* Render more feeds */
                    const renderMore =
                        (Math.abs(top) - scaffoldHeight) < scaffoldHeight &&
                        feeds.current.length > 0;
                    const rdm = shouldRenderFeeds.current;
                    if (renderMore && !shouldRenderFeeds.current)
                        shouldRenderFeeds.current = true;
                    else if (!renderMore && shouldRenderFeeds.current)
                        shouldRenderFeeds.current = false;
                    if (rdm !== shouldRenderFeeds.current)
                        renderMoreFeedsFunc();
                })
                .catch((e: any) => { logFunc('Err [TopSensor] :: watchSensorFunc() =>', e.message) })
                .finally(() => {
                    if (frameReqRef.current)
                        cancelAnimationFrame(frameReqRef.current);
                    if (shouldRenderFeeds.current) {
                        /* Detach sensor from scroll event */
                        controllerRef.current?.attachScrollEventFunc({
                            eventId: wid,
                            type: 'sensor',
                            action: 'detach'
                        });

                        /* Request new frame update */
                        frameReqRef.current = requestAnimationFrame(watchSensorFunc);

                    } else {
                        /* - */
                        frameReqRef.current = undefined;

                        /* Attach sensor to scroll event */
                        controllerRef.current?.attachScrollEventFunc({
                            eventId: wid,
                            type: 'sensor',
                            action: 'attach',
                            callback: watchSensorFunc
                        });
                    }

                    /* - */
                    if (feeds.current.length === 0)
                        controllerRef.current.showLoadingFunc({
                            position: 'top',
                            isLoading: false,
                            visible: false
                        });

                    /* Very important • Determine and Stabilize rendering cycle */
                    renderingBatchCount.current += 1;
                    isRenderingMoreFeeds.current = false;
                    shouldRenderFeeds.current = false;

                    /* Enable watcher • Should always come LAST */
                    suspendWatcher.current = false;
                });

        }).catch(() => { suspendWatcher.current = false });
    };

    /* Render more feeds */
    const renderMoreFeedsFunc = () => {
        if (isRenderingMoreFeeds.current || feeds.current.length === 0)
            return;
        try {
            /* Set top loading state */
            controllerRef.current.showLoadingFunc({
                position: 'top',
                isLoading: true,
                visible: true
            });

            /* - */
            feeds.current.reverse();
            let fd = feeds.current.splice(0, _default_first_batch_ * 2);
            fd.reverse();
            feeds.current.reverse();

            /* - */
            const firstFeedId: any = controllerRef.current.getFeedFromIndexFunc({ index: 0 });
            controllerRef.current.renderFeedsFunc({
                targetId: firstFeedId,
                position: 'before',
                feeds: fd
            });

        } catch (e: any) {
            controllerRef.current.showLoadingFunc({
                position: 'top',
                isLoading: false,
                visible: false
            });
            logFunc('err :: renderMoreFeedsFunc() =>', e.message);
        }
    };


    /* -------------------------- Hooks -------------------------- */

    /* Imperative Handle */
    useImperativeHandle(ref, () => ({
    }), []);

    /* On mount */
    useEffect(onMountFunc, [mountAgain]);


    /* -------------------------- Component -------------------------- */

    const component = <View ref={sensorRef} style={{ width: 0, height: 0 }} />;
    return (render.current && component);
});

/*
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
*/

/* ----------------------------------------- Loading ----------------------------------------- */

const Loading = forwardRef((props: { wid?: string, visible: boolean, isLoading: boolean, customComponent?: JSX.Element }, ref: any) => {
    /* -------------------------- Constants -------------------------- */

    const refresher = useRef(false);
    const [_, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const render = useRef(true);

    const isDev = isDevFunc();
    const remountingTimer = useRef<any>(null);
    const cleanUpReady = useRef(false);
    const again = useRef(false);
    const [mountAgain, setMountAgain] = useState(again.current);

    const wid = useRef(props.wid || generateIdFunc()).current;
    const visible = useRef(props.visible);
    const isLoading = useRef(props.isLoading);
    const customComponent = useRef<JSX.Element | undefined>(props.customComponent || undefined);


    /* -------------------------- Methods -------------------------- */

    /* Refresh component */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* On mount - Run once */
    const onMountFunc = () => {
        /* - */
        if (isMounted.current) {
            cleanUpReady.current = true;
            return () => onUnmountFunc(); /* Clean up */
        }
        isMounted.current = true;

        /* Prevent double rendering side effects, caused by "Strict Mode" */
        if (isDev && !again.current) {
            again.current = true;
            delayFunc().then(() => {
                remountingTimer.current = setTimeout(() => {
                    if (cleanUpReady.current)
                        return;
                    setMountAgain(again.current);
                }, _remount_timout_);
            });
        }

        /* Clean up */
        return isDev ? undefined : () => onUnmountFunc();
    };

    /* On unmount */
    const onUnmountFunc = () => {
        /* Clear timer */
        clearTimeout(remountingTimer.current);
    };

    /* Show loading */
    const showFunc = (show: boolean) => {
        visible.current = show;
        refreshFunc();
    };

    /* Set loading state */
    const isLoadingFunc = (loading: boolean) => {
        isLoading.current = loading;
        refreshFunc();
    };


    /* -------------------------- Hooks -------------------------- */

    /* Imperative Handle */
    useImperativeHandle(ref, () => ({
        showFunc: showFunc,
        isLoadingFunc: isLoadingFunc
    }), []);

    /* On mount */
    useEffect(onMountFunc, [mountAgain]);


    /* -------------------------- Component -------------------------- */

    const component = <>
        {visible.current &&
            <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                {isLoading.current ?
                    <>
                        {(customComponent.current === undefined) ?
                            <Image source={{ uri: `data:image/gif;base64,${loadingGif}` }} style={{ width: 50, height: 50 }} />
                            :
                            <>{customComponent.current}</>
                        }
                    </>
                    :
                    <Text style={{ color: '#607D8B', fontSize: 12 }}>•••</Text>
                }
            </View>
        }
    </>;
    return (render.current && component);
});

/*
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
-
*/

/* ----------------------------------------- Hooks ----------------------------------------- */

/** Detect if the target FeedList is mounted or not. */
export const useIsMounted = (feedListId: string): boolean => {
    /* -------------------------- Constants -------------------------- */

    const refresher = useRef(false);
    const [_, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const scaffoldId = feedListId;
    const hookId = useRef(generateIdFunc()).current;
    const hookIndex = 0;

    const isDev = isDevFunc();
    const remountingTimer = useRef<any>(null);
    const cleanUpReady = useRef(false);
    const again = useRef(false);
    const [mountAgain, setMountAgain] = useState(again.current);

    const scope = feedListScopeDATA.current[feedListId] || undefined;
    const scopeExists = (!scope || !scope.controllerRef) ? false : true;
    const controllerRef = (!scopeExists || !scope.controllerRef.current) ? { current: undefined } : scope.controllerRef;
    const feedListIsMounted = controllerRef.current !== undefined && controllerRef.current !== null;


    /* -------------------------- Methods -------------------------- */

    /* Refresh Hook */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Update hook */
    const updateHookFunc = <T extends HOOKS_NAME_TYPE>(hookName: T, value: UPDATE_HOOK_ARG_VALUE_TYPE<T>): void => { refreshFunc() };

    /* Prepare hook listener if the target "feedList" scope doesn't exists yet */
    if (!scopeExists || (scopeExists && !(scope as any)[hookId]))
        prepareHookListenerFunc({
            action: 'attach',
            hookIndex,
            hookId,
            hookName: 'useIsMounted',
            scaffoldId: scaffoldId,
            refreshHook: refreshFunc,
            updateHook: updateHookFunc
        });

    /* On mount */
    const onMountFunc = () => {
        /* - */
        if (isMounted.current) {
            cleanUpReady.current = true;
            return () => onUnmountFunc(); /* Clean up */
        }
        isMounted.current = true;

        /* Prevent double rendering side effects, caused by "Strict Mode" */
        if (isDev && !again.current) {
            again.current = true;
            delayFunc().then(() => {
                remountingTimer.current = setTimeout(() => {
                    if (cleanUpReady.current)
                        return;
                    setMountAgain(again.current);
                }, _remount_timout_);
            });
        }

        /* Attach listener */
        controllerRef.current?.attachHookListenerFunc({
            action: 'attach',
            hookIndex,
            hookId,
            hookName: 'useIsMounted',
            refreshHook: refreshFunc,
            updateHook: updateHookFunc
        });

        /* Clean up */
        return isDev ? undefined : () => onUnmountFunc();
    };

    /* On unmount */
    const onUnmountFunc = () => {
        /* Clear timer */
        clearTimeout(remountingTimer.current);
        /* Detach listener */
        controllerRef.current?.attachHookListenerFunc({ action: 'detach', hookId });
    };


    /* -------------------------- Hooks -------------------------- */

    /* On mount */
    useEffect(onMountFunc, [mountAgain]);


    /* -------------------------- States -------------------------- */

    return feedListIsMounted;
};


/** 
* Access the ref of the "FeedList" component. 
* 
* CAUTION: Avoid using it inside the same component where the corresponding FeedList component is used, to avoid issues.
*/
export const useFeedListRef = (feedListId: string): RefObject<FL_PUBLIC_APIs_TYPE | undefined> => {
    /* -------------------------- Constants -------------------------- */

    const refresher = useRef(false);
    const [_, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const scaffoldId = feedListId;
    const hookId = useRef(generateIdFunc()).current;
    const hookIndex = 1;

    const isDev = isDevFunc();
    const remountingTimer = useRef<any>(null);
    const cleanUpReady = useRef(false);
    const again = useRef(false);
    const [mountAgain, setMountAgain] = useState(again.current);

    const scope = feedListScopeDATA.current[feedListId] || undefined;
    const scopeExists = (!scope || !scope.controllerRef) ? false : true;
    const controllerRef = (!scopeExists || !scope.controllerRef.current) ? { current: undefined } : scope.controllerRef;
    const feedListIsMounted = controllerRef.current !== undefined && controllerRef.current !== null;


    /* -------------------------- Methods -------------------------- */

    /* Refresh Hook */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Update hook */
    const updateHookFunc = <T extends HOOKS_NAME_TYPE>(hookName: T, value: UPDATE_HOOK_ARG_VALUE_TYPE<T>): void => { refreshFunc() };

    /* Prepare hook listener if the target "feedList" scope doesn't exists yet */
    if (!scopeExists || (scopeExists && !(scope as any)[hookId]))
        prepareHookListenerFunc({
            action: 'attach',
            hookIndex,
            hookId,
            hookName: 'useFeedListRef',
            scaffoldId: scaffoldId,
            refreshHook: refreshFunc,
            updateHook: updateHookFunc
        });

    /* On mount */
    const onMountFunc = () => {
        /* - */
        if (isMounted.current) {
            cleanUpReady.current = true;
            return () => onUnmountFunc(); /* Clean up */
        }
        isMounted.current = true;

        /* Prevent double rendering side effects, caused by "Strict Mode" */
        if (isDev && !again.current) {
            again.current = true;
            delayFunc().then(() => {
                remountingTimer.current = setTimeout(() => {
                    if (cleanUpReady.current)
                        return;
                    setMountAgain(again.current);
                }, _remount_timout_);
            });
        }

        /* Attach listener */
        controllerRef.current?.attachHookListenerFunc({
            action: 'attach',
            hookIndex,
            hookId,
            hookName: 'useFeedListRef',
            refreshHook: refreshFunc,
            updateHook: updateHookFunc
        });

        /* Clean up */
        return isDev ? undefined : () => onUnmountFunc();
    };

    /* On unmount */
    const onUnmountFunc = () => {
        /* Clear timer */
        clearTimeout(remountingTimer.current);
        /* Detach listener */
        controllerRef.current?.attachHookListenerFunc({ action: 'detach', hookId });
    };


    /* -------------------------- Hooks -------------------------- */

    /* On mount */
    useEffect(onMountFunc, [mountAgain]);


    /* -------------------------- States -------------------------- */

    return !feedListIsMounted ? { current: undefined } : scope.ref;
};


/** Track some scroll events. */
export const useScrollEvent = (feedListId: string): FL_USE_ON_SCROLL_HOOK_RETURN_TYPE | undefined => {
    /* -------------------------- Constants -------------------------- */

    const refresher = useRef(false);
    const [_, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const scaffoldId = feedListId;
    const hookId = useRef(generateIdFunc()).current;
    const hookIndex = 2;

    const isDev = isDevFunc();
    const remountingTimer = useRef<any>(null);
    const cleanUpReady = useRef(false);
    const again = useRef(false);
    const [mountAgain, setMountAgain] = useState(again.current);

    const isScrolling = useRef(false);
    const velocity = useRef(0);
    const scrollDirectionX = useRef<SCROLL_DIRECTION_X_TYPE>(undefined);
    const scrollDirectionY = useRef<SCROLL_DIRECTION_Y_TYPE>(undefined);

    const scope = feedListScopeDATA.current[feedListId] || undefined;
    const scopeExists = (!scope || !scope.controllerRef) ? false : true;
    const controllerRef = (!scopeExists || !scope.controllerRef.current) ? { current: undefined } : scope.controllerRef;
    const feedListIsMounted = controllerRef.current !== undefined && controllerRef.current !== null;


    /* -------------------------- Methods -------------------------- */

    /* Refresh Hook */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Update hook */
    const updateHookFunc = <T extends HOOKS_NAME_TYPE>(hookName: T, value: UPDATE_HOOK_ARG_VALUE_TYPE<T>): void => {
        const val = value as USE_ON_SCROLL_HOOK_VALUE_TYPE;
        if (
            isScrolling.current === val.isScrolling &&
            // velocity.current === val.velocity &&
            scrollDirectionX.current === val.scrollDirectionX &&
            scrollDirectionY.current === val.scrollDirectionY
        ) return;

        /* - */
        isScrolling.current = val.isScrolling;
        // velocity.current = val.velocity;
        scrollDirectionX.current = val.scrollDirectionX;
        scrollDirectionY.current = val.scrollDirectionY;
        refreshFunc();
    };

    /* Prepare hook listener if the target "feedList" scope doesn't exists yet */
    if (!scopeExists || (scopeExists && !(scope as any)[hookId]))
        prepareHookListenerFunc({
            action: 'attach',
            hookIndex,
            hookId,
            hookName: 'useScrollEvent',
            scaffoldId: scaffoldId,
            refreshHook: refreshFunc,
            updateHook: updateHookFunc
        });

    /* On mount */
    const onMountFunc = () => {
        /* - */
        if (isMounted.current) {
            cleanUpReady.current = true;
            return () => onUnmountFunc(); /* Clean up */
        }
        isMounted.current = true;

        /* Prevent double rendering side effects, caused by "Strict Mode" */
        if (isDev && !again.current) {
            again.current = true;
            delayFunc().then(() => {
                remountingTimer.current = setTimeout(() => {
                    if (cleanUpReady.current)
                        return;
                    setMountAgain(again.current);
                }, _remount_timout_);
            });
        }

        /* Attach listener */
        controllerRef.current?.attachHookListenerFunc({
            action: 'attach',
            hookIndex,
            hookId,
            hookName: 'useScrollEvent',
            refreshHook: refreshFunc,
            updateHook: updateHookFunc
        });

        /* Clean up */
        return isDev ? undefined : () => onUnmountFunc();
    };

    /* On unmount */
    const onUnmountFunc = () => {
        /* Clear timer */
        clearTimeout(remountingTimer.current);
        /* Detach listener */
        controllerRef.current?.attachHookListenerFunc({ action: 'detach', hookId });
    };


    /* -------------------------- Hooks -------------------------- */

    /* On mount */
    useEffect(onMountFunc, [mountAgain]);


    /* -------------------------- States -------------------------- */

    return !feedListIsMounted ? undefined : {
        isScrolling: isScrolling.current,
        orientation: controllerRef.current?.orientation!,
        // velocity: velocity.current,
        scrollDirectionX: scrollDirectionX.current,
        scrollDirectionY: scrollDirectionY.current,
    };
};


/** Return the scroll amount. */
export const useScrollAmount = (feedListId: string): FL_USE_SCROLL_AMOUNT_HOOK_RETURN_TYPE | undefined => {
    /* -------------------------- Constants -------------------------- */

    const refresher = useRef(false);
    const [_, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const scaffoldId = feedListId;
    const hookId = useRef(generateIdFunc()).current;
    const hookIndex = 2;

    const isDev = isDevFunc();
    const remountingTimer = useRef<any>(null);
    const cleanUpReady = useRef(false);
    const again = useRef(false);
    const [mountAgain, setMountAgain] = useState(again.current);

    const scrollAmount = useRef<FL_USE_SCROLL_AMOUNT_HOOK_RETURN_TYPE>({ prev: 0, current: 0, endReached: false });

    const scope = feedListScopeDATA.current[feedListId] || undefined;
    const scopeExists = (!scope || !scope.controllerRef) ? false : true;
    const controllerRef = (!scopeExists || !scope.controllerRef.current) ? { current: undefined } : scope.controllerRef;
    const feedListIsMounted = controllerRef.current !== undefined && controllerRef.current !== null;


    /* -------------------------- Methods -------------------------- */

    /* Refresh Hook */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Update hook */
    const updateHookFunc = <T extends HOOKS_NAME_TYPE>(hookName: T, value: UPDATE_HOOK_ARG_VALUE_TYPE<T>): void => {
        const val = value as FL_USE_SCROLL_AMOUNT_HOOK_VALUE_TYPE;

        const sameAmount = scrollAmount.current.current === val.amount;
        const same = scrollAmount.current.endReached === val.endReached;

        if (sameAmount && same)
            return;
        else if (sameAmount && !same)
            scrollAmount.current.endReached = val.endReached;
        else {
            const prev = { ...scrollAmount.current }.current;
            scrollAmount.current = { prev, current: val.amount, endReached: val.endReached };
        }

        refreshFunc();
    };

    /* Prepare hook listener if the target "feedList" scope doesn't exists yet */
    if (!scopeExists || (scopeExists && !(scope as any)[hookId]))
        prepareHookListenerFunc({
            action: 'attach',
            hookIndex,
            hookId,
            hookName: 'useScrollAmount',
            scaffoldId: scaffoldId,
            refreshHook: refreshFunc,
            updateHook: updateHookFunc
        });

    /* On mount */
    const onMountFunc = () => {
        /* - */
        if (isMounted.current) {
            cleanUpReady.current = true;
            return () => onUnmountFunc(); /* Clean up */
        }
        isMounted.current = true;

        /* Prevent double rendering side effects, caused by "Strict Mode" */
        if (isDev && !again.current) {
            again.current = true;
            delayFunc().then(() => {
                remountingTimer.current = setTimeout(() => {
                    if (cleanUpReady.current)
                        return;
                    setMountAgain(again.current);
                }, _remount_timout_);
            });
        }

        /* Attach listener */
        controllerRef.current?.attachHookListenerFunc({
            action: 'attach',
            hookIndex,
            hookId,
            hookName: 'useScrollAmount',
            refreshHook: refreshFunc,
            updateHook: updateHookFunc
        });

        /* Clean up */
        return isDev ? undefined : () => onUnmountFunc();
    };

    /* On unmount */
    const onUnmountFunc = () => {
        /* Clear timer */
        clearTimeout(remountingTimer.current);
        /* Detach listener */
        controllerRef.current?.attachHookListenerFunc({ action: 'detach', hookId });
    };


    /* -------------------------- Hooks -------------------------- */

    /* On mount */
    useEffect(onMountFunc, [mountAgain]);


    /* -------------------------- States -------------------------- */

    return !feedListIsMounted ? undefined : scrollAmount.current;
};


/** Return a list of visible feeds. */
export const useVisibleFeeds = (feedListId: string): FL_VISIBLE_FEEDS_DT_TYPE[] | undefined => {
    /* -------------------------- Constants -------------------------- */

    const refresher = useRef(false);
    const [_, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const scaffoldId = feedListId;
    const hookId = useRef(generateIdFunc()).current;
    const hookIndex = 3;

    const isDev = isDevFunc();
    const remountingTimer = useRef<any>(null);
    const cleanUpReady = useRef(false);
    const again = useRef(false);
    const [mountAgain, setMountAgain] = useState(again.current);

    const visibleFeeds = useRef<FL_VISIBLE_FEEDS_DT_TYPE[]>([]);

    const scope = feedListScopeDATA.current[feedListId] || undefined;
    const scopeExists = (!scope || !scope.controllerRef) ? false : true;
    const controllerRef = (!scopeExists || !scope.controllerRef.current) ? { current: undefined } : scope.controllerRef;
    const feedListIsMounted = controllerRef.current !== undefined && controllerRef.current !== null;


    /* -------------------------- Methods -------------------------- */

    /* Refresh Hook */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Update hook */
    const updateHookFunc = <T extends HOOKS_NAME_TYPE>(hookName: T, value: UPDATE_HOOK_ARG_VALUE_TYPE<T>): void => {
        const val = value as FL_VISIBLE_FEEDS_DT_TYPE[];
        visibleFeeds.current = val;
        refreshFunc();
    };

    /* Prepare hook listener if the target "feedList" scope doesn't exists yet */
    if (!scopeExists || (scopeExists && !(scope as any)[hookId]))
        prepareHookListenerFunc({
            action: 'attach',
            hookIndex,
            hookId,
            hookName: 'useVisibleFeeds',
            scaffoldId: scaffoldId,
            refreshHook: refreshFunc,
            updateHook: updateHookFunc
        });

    /* On mount */
    const onMountFunc = () => {
        /* - */
        if (isMounted.current) {
            cleanUpReady.current = true;
            return () => onUnmountFunc(); /* Clean up */
        }
        isMounted.current = true;

        /* Prevent double rendering side effects, caused by "Strict Mode" */
        if (isDev && !again.current) {
            again.current = true;
            delayFunc().then(() => {
                remountingTimer.current = setTimeout(() => {
                    if (cleanUpReady.current)
                        return;
                    setMountAgain(again.current);
                }, _remount_timout_);
            });
        }

        /* Attach listener */
        controllerRef.current?.attachHookListenerFunc({
            action: 'attach',
            hookIndex,
            hookId,
            hookName: 'useVisibleFeeds',
            refreshHook: refreshFunc,
            updateHook: updateHookFunc
        });

        /* Clean up */
        return isDev ? undefined : () => onUnmountFunc();
    };

    /* On unmount */
    const onUnmountFunc = () => {
        /* Detach listener */
        controllerRef.current?.attachHookListenerFunc({ action: 'detach', hookId });
    };


    /* -------------------------- Hooks -------------------------- */

    /* On mount */
    useEffect(onMountFunc, [mountAgain]);


    /* -------------------------- States -------------------------- */

    return !feedListIsMounted ? undefined : visibleFeeds.current;
};


/** Track header component visibility. */
export const useIsHeaderVisible = (feedListId: string): boolean | undefined => {
    /* -------------------------- Constants -------------------------- */

    const refresher = useRef(false);
    const [_, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const scaffoldId = feedListId;
    const hookId = useRef(generateIdFunc()).current;
    const hookIndex = 1;

    const isDev = isDevFunc();
    const remountingTimer = useRef<any>(null);
    const cleanUpReady = useRef(false);
    const again = useRef(false);
    const [mountAgain, setMountAgain] = useState(again.current);

    const isVisible = useRef(false);

    const scope = feedListScopeDATA.current[feedListId] || undefined;
    const scopeExists = (!scope || !scope.controllerRef) ? false : true;
    const controllerRef = (!scopeExists || !scope.controllerRef.current) ? { current: undefined } : scope.controllerRef;
    const feedListIsMounted = controllerRef.current !== undefined && controllerRef.current !== null;

    if (scopeExists) isVisible.current = controllerRef.current?.headerVisibility.current!;


    /* -------------------------- Methods -------------------------- */

    /* Refresh Hook */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Update hook */
    const updateHookFunc = <T extends HOOKS_NAME_TYPE>(hookName: T, value: UPDATE_HOOK_ARG_VALUE_TYPE<T>): void => {
        const val = value as boolean;
        isVisible.current = val;
        refreshFunc();
    };

    /* Prepare hook listener if the target "feedList" scope doesn't exists yet */
    if (!scopeExists || (scopeExists && !(scope as any)[hookId]))
        prepareHookListenerFunc({
            action: 'attach',
            hookIndex,
            hookId,
            hookName: 'useIsHeaderVisible',
            scaffoldId: scaffoldId,
            refreshHook: refreshFunc,
            updateHook: updateHookFunc
        });

    /* On mount */
    const onMountFunc = () => {
        /* - */
        if (isMounted.current) {
            cleanUpReady.current = true;
            return () => onUnmountFunc(); /* Clean up */
        }
        isMounted.current = true;

        /* Prevent double rendering side effects, caused by "Strict Mode" */
        if (isDev && !again.current) {
            again.current = true;
            delayFunc().then(() => {
                remountingTimer.current = setTimeout(() => {
                    if (cleanUpReady.current)
                        return;
                    setMountAgain(again.current);
                }, _remount_timout_);
            });
        }

        /* Attach listener */
        controllerRef.current?.attachHookListenerFunc({
            action: 'attach',
            hookIndex,
            hookId,
            hookName: 'useIsHeaderVisible',
            refreshHook: refreshFunc,
            updateHook: updateHookFunc
        });

        /* Clean up */
        return isDev ? undefined : () => onUnmountFunc();
    };

    /* On unmount */
    const onUnmountFunc = () => {
        /* Clear timer */
        clearTimeout(remountingTimer.current);
        /* Detach listener */
        controllerRef.current?.attachHookListenerFunc({ action: 'detach', hookId });
    };


    /* -------------------------- Hooks -------------------------- */

    /* On mount */
    useEffect(onMountFunc, [mountAgain]);


    /* -------------------------- States -------------------------- */

    return !feedListIsMounted ? undefined : isVisible.current;
};


/** Track footer component visibility. */
export const useIsFooterVisible = (feedListId: string): boolean | undefined => {
    /* -------------------------- Constants -------------------------- */

    const refresher = useRef(false);
    const [_, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const scaffoldId = feedListId;
    const hookId = useRef(generateIdFunc()).current;
    const hookIndex = 1;

    const isDev = isDevFunc();
    const remountingTimer = useRef<any>(null);
    const cleanUpReady = useRef(false);
    const again = useRef(false);
    const [mountAgain, setMountAgain] = useState(again.current);

    const isVisible = useRef(false);

    const scope = feedListScopeDATA.current[feedListId] || undefined;
    const scopeExists = (!scope || !scope.controllerRef) ? false : true;
    const controllerRef = (!scopeExists || !scope.controllerRef.current) ? { current: undefined } : scope.controllerRef;
    const feedListIsMounted = controllerRef.current !== undefined && controllerRef.current !== null;

    if (scopeExists) isVisible.current = controllerRef.current?.footerVisibility.current!;


    /* -------------------------- Methods -------------------------- */

    /* Refresh Hook */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Update hook */
    const updateHookFunc = <T extends HOOKS_NAME_TYPE>(hookName: T, value: UPDATE_HOOK_ARG_VALUE_TYPE<T>): void => {
        const val = value as boolean;
        isVisible.current = val;
        refreshFunc();
    };

    /* Prepare hook listener if the target "feedList" scope doesn't exists yet */
    if (!scopeExists || (scopeExists && !(scope as any)[hookId]))
        prepareHookListenerFunc({
            action: 'attach',
            hookIndex,
            hookId,
            hookName: 'useIsFooterVisible',
            scaffoldId: scaffoldId,
            refreshHook: refreshFunc,
            updateHook: updateHookFunc
        });

    /* On mount */
    const onMountFunc = () => {
        /* - */
        if (isMounted.current) {
            cleanUpReady.current = true;
            return () => onUnmountFunc(); /* Clean up */
        }
        isMounted.current = true;

        /* Prevent double rendering side effects, caused by "Strict Mode" */
        if (isDev && !again.current) {
            again.current = true;
            delayFunc().then(() => {
                remountingTimer.current = setTimeout(() => {
                    if (cleanUpReady.current)
                        return;
                    setMountAgain(again.current);
                }, _remount_timout_);
            });
        }

        /* Attach listener */
        controllerRef.current?.attachHookListenerFunc({
            action: 'attach',
            hookIndex,
            hookId,
            hookName: 'useIsFooterVisible',
            refreshHook: refreshFunc,
            updateHook: updateHookFunc
        });

        /* Clean up */
        return isDev ? undefined : () => onUnmountFunc();
    };

    /* On unmount */
    const onUnmountFunc = () => {
        /* Clear timer */
        clearTimeout(remountingTimer.current);
        /* Detach listener */
        controllerRef.current?.attachHookListenerFunc({ action: 'detach', hookId });
    };


    /* -------------------------- Hooks -------------------------- */

    /* On mount */
    useEffect(onMountFunc, [mountAgain]);


    /* -------------------------- States -------------------------- */

    return !feedListIsMounted ? undefined : isVisible.current;
};


/** Detect whether the list's end is reached or not. */
export const useIsListEndReached = (feedListId: string): boolean | undefined => {
    /* -------------------------- Constants -------------------------- */

    const refresher = useRef(false);
    const [_, setRefresh] = useState(refresher.current);

    const isMounted = useRef(false);
    const scaffoldId = feedListId;
    const hookId = useRef(generateIdFunc()).current;
    const hookIndex = 3;

    const isDev = isDevFunc();
    const remountingTimer = useRef<any>(null);
    const cleanUpReady = useRef(false);
    const again = useRef(false);
    const [mountAgain, setMountAgain] = useState(again.current);

    const endReached = useRef(false);

    const scope = feedListScopeDATA.current[feedListId] || undefined;
    const scopeExists = (!scope || !scope.controllerRef) ? false : true;
    const controllerRef = (!scopeExists || !scope.controllerRef.current) ? { current: undefined } : scope.controllerRef;
    const feedListIsMounted = controllerRef.current !== undefined && controllerRef.current !== null;


    /* -------------------------- Methods -------------------------- */

    /* Refresh Hook */
    const refreshFunc = () => { refresher.current = !refresher.current; setRefresh(refresher.current) };

    /* Update hook */
    const updateHookFunc = <T extends HOOKS_NAME_TYPE>(hookName: T, value: UPDATE_HOOK_ARG_VALUE_TYPE<T>): void => {
        const val = value as boolean;
        endReached.current = val;
        refreshFunc();
    };

    /* Prepare hook listener if the target "feedList" scope doesn't exists yet */
    if (!scopeExists || (scopeExists && !(scope as any)[hookId]))
        prepareHookListenerFunc({
            action: 'attach',
            hookIndex,
            hookId,
            hookName: 'useIsListEndReached',
            scaffoldId: scaffoldId,
            refreshHook: refreshFunc,
            updateHook: updateHookFunc
        });

    /* On mount */
    const onMountFunc = () => {
        /* - */
        if (isMounted.current) {
            cleanUpReady.current = true;
            return () => onUnmountFunc(); /* Clean up */
        }
        isMounted.current = true;

        /* Prevent double rendering side effects, caused by "Strict Mode" */
        if (isDev && !again.current) {
            again.current = true;
            delayFunc().then(() => {
                remountingTimer.current = setTimeout(() => {
                    if (cleanUpReady.current)
                        return;
                    setMountAgain(again.current);
                }, _remount_timout_);
            });
        }

        /* Attach listener */
        controllerRef.current?.attachHookListenerFunc({
            action: 'attach',
            hookIndex,
            hookId,
            hookName: 'useIsListEndReached',
            refreshHook: refreshFunc,
            updateHook: updateHookFunc
        });

        /* Clean up */
        return isDev ? undefined : () => onUnmountFunc();
    };

    /* On unmount */
    const onUnmountFunc = () => {
        /* Clear timer */
        clearTimeout(remountingTimer.current);
        /* Detach listener */
        controllerRef.current?.attachHookListenerFunc({ action: 'detach', hookId });
    };


    /* -------------------------- Hooks -------------------------- */

    /* On mount */
    useEffect(onMountFunc, [mountAgain]);


    /* -------------------------- States -------------------------- */

    return !feedListIsMounted ? undefined : endReached.current;
};


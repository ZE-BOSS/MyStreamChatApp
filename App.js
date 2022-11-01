import React from 'react';
import {
  Chat,
  ChannelList,
  OverlayProvider,
  Channel,
  MessageList,
  MessageInput,
  Thread,
  ChannelPreviewMessenger,
  useMessageContext,
} from 'stream-chat-expo'; // Or stream-chat-react-native
import { AppProvider } from "./src/AppContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { useChatClient } from './src/useChatClient';
import { StreamChat } from 'stream-chat';
import { chatApiKey, chatUserId } from './src/chatConfig';
import { useAppContext } from './src/AppContext';

const chatClient = StreamChat.getInstance(chatApiKey);

const Stack = createStackNavigator();

const filters = {
  members: {
    '$in': [chatUserId]
  },
};

const sort = {
  last_message_at: -1,
};

const chatTheme = {
  channelPreview: {
    container: {
      backgroundColor: 'transparent',
    }
  }
};

const CustomMessage = () => {
  const { message, isMyMessage } = useMessageContext();

  return (
    <View style={{
      alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
      backgroundColor: isMyMessage ? '#ADD8E6' : '#ededed',
      padding: 10,
      margin: 10,
      borderRadius: 10,
      width: '70%',
    }}>
      <Text>{message.text}</Text>
    </View>
  )
}

const CustomListItem = (props) => {
  const { unread } = props;
  const backgroundColor = unread ? '#e6f7ff' : '#fff';

  return (
    <View style={{ backgroundColor }}>
      <ChannelPreviewMessenger {...props} />
    </View>
  );
}

const ChannelScreen = props => {
  const { navigation } = props;
  const { channel, setThread } = useAppContext();

  return (
    <Channel 
      channel={channel}
      //MessageSimple={CustomMessage}
    >
      <MessageList 
        onThreadSelect={(message) => {
          if (channel?.id) {
            setThread(message);
            navigation.navigate('ThreadScreen');
          }
        }}
      />
      <MessageInput />
    </Channel>
  );
}

const ChannelListScreen = () => {
  const { setChannel } = useAppContext();
  return (
    <ChannelList
      onSelect={(channel) => {
        const { navigation } = props;
        setChannel(channel);
        navigation.navigate('ChannelScreen');
      }}
      Preview={CustomListItem}
      filters={filters}
      sort={sort}
    />
  )
}

const ThreadScreen = props => {
  const { channel, thread } = useAppContext();

  return (
    <Channel channel={channel} thread={message} threadList>
      <Thread />
    </Channel>
  );
}

const NavigationStack = () => {
  const { clientIsReady } = useChatClient();

  if (!clientIsReady) {
    return <Text>Loading chat ...</Text>
  }

  return (
    <OverlayProvider 
      //value={{ theme: chatTheme }}
    >
      <Chat client={chatClient} enableOfflineSupport>
        <Stack.Navigator>
          <Stack.Screen name="ChannelListScreen" component={ChannelListScreen} />
          <Stack.Screen name="ChannelScreen" component={ChannelScreen} />
          <Stack.Screen name="ThreadScreen" component={ThreadScreen} />
        </Stack.Navigator>
      </Chat>
    </OverlayProvider>
  );
};

export default () => {
  return (
    <AppProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer>
            <NavigationStack />
          </NavigationContainer>
        </SafeAreaView>
      </GestureHandlerRootView>
    </AppProvider>
  );
};
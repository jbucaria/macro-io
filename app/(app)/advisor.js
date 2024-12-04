import React from 'react'
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import BottomBar from '@/src/components/view/BottomBar'
import { useChat } from '@/src/hooks/useChat'
import IngredientsView from '@/src/components/view/IngredientsView'
import MessageSendTextView from '@/src/components/message/ MessageSendTextView'
import MessageResponseView from '@/src/components/message/MessageRespondView'
import MessageSendImageView from '@/src/components/message/MessageSendImageView'
import TypingView from '@/src/components/message/TypingView'

const ChatScreen = ({ onClose }) => {
  const {
    inputMessage,
    messages,
    ingredientAdvisorResponse,
    sending,
    configureStatus,
    onChangeTextInput,
    onPressSendBtn,
    onPressPlusIcon,
    onCloseIngredientView,
    fetchIngredients,
  } = useChat()
  const styles = chatStyle()

  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'text':
        return (
          <MessageSendTextView
            msg={
              item.type === 'text'
                ? item.message ?? ''
                : item.response?.markupContent ?? ''
            }
          />
        )
      case 'response':
        return (
          <MessageResponseView
            response={item.response}
            error={item.error}
            onResponse={fetchIngredients}
          />
        )
      case 'image':
        return <MessageSendImageView imgUrl={item.uri} />
      case 'typing':
        return <TypingView />
      default:
        return null
    }
  }

  return (
    <>
      <SafeAreaView style={styles.body}>
        <View style={styles.closeButton}>
          <TouchableOpacity onPress={onClose}>
            <Image
              style={styles.closeText}
              source={require('@/assets/images/back.png')}
            />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          style={styles.body}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.body, styles.container]}>
            <View style={styles.chatBody}>
              <View style={styles.chatBodyContainer}>
                <FlatList
                  data={messages}
                  keyExtractor={(_item, index) => index.toString()}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                  style={styles.flatListStyle}
                />
              </View>
            </View>
            <View style={styles.bottomView}>
              {configureStatus === 'Success' ? (
                <BottomBar
                  inputValue={inputMessage}
                  textInputChnageHandler={onChangeTextInput}
                  sendBtnHandler={onPressSendBtn}
                  plusIconHandler={onPressPlusIcon}
                  sending={sending}
                />
              ) : (
                <ActivityIndicator />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
        {ingredientAdvisorResponse && (
          <IngredientsView
            response={ingredientAdvisorResponse}
            onClose={onCloseIngredientView}
          />
        )}
      </SafeAreaView>
    </>
  )
}

// Styles for the component
const chatStyle = () =>
  StyleSheet.create({
    body: {
      backgroundColor: 'rgba(242, 245, 251, 1)',
      flex: 1,
    },
    chatBody: {
      flex: 1,
    },
    bottomView: {
      marginBottom: 40,
    },
    container: {
      paddingHorizontal: 16,
    },
    closeButton: {},
    closeText: {
      margin: 16,
      height: 24,
      width: 24,
    },
    chatBodyContainer: {
      flex: 1,
    },
    flatListStyle: {
      marginBottom: 10,
    },
  })

export default ChatScreen

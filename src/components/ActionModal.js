import React from 'react'
import { BlurView } from 'expo-blur'
import { View, Text, Pressable, Modal } from 'react-native'
import { IconSymbol } from '@/src/components/ui/IconSymbol'
import { Link } from 'expo-router'

const ActionModal = ({ visible, onClose, closeModal }) => {
  console.log('Rendering ActionModal with props:', { visible, onClose })
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Modal Content */}
        <View
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 20,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 20,
            }}
          >
            Choose an Option
          </Text>

          {/* Icons in Grid (2x2) */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            {/* Top Row Icons */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Link href={'/barcode'} asChild>
                <Pressable
                  style={{ alignItems: 'center' }}
                  onPress={closeModal}
                >
                  <IconSymbol
                    name="barcode.viewfinder"
                    size={40}
                    color="#000"
                  />
                  <Text style={{ marginTop: 10 }}>Barcode</Text>
                </Pressable>
              </Link>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Link href={'camera'} asChild>
                <Pressable
                  style={{ alignItems: 'center' }}
                  onPress={closeModal}
                >
                  <IconSymbol name="camera" size={40} color="#000" />
                  <Text style={{ marginTop: 10 }}>Image</Text>
                </Pressable>
              </Link>
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            {/* Bottom Row Icons */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Link href={'foodSearch'} asChild>
                <Pressable
                  style={{ alignItems: 'center' }}
                  onPress={closeModal}
                >
                  <IconSymbol name="fork.knife" size={40} color="#000" />
                  <Text style={{ marginTop: 10 }}>Food</Text>
                </Pressable>
              </Link>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Link href={'/advisor'} asChild>
                <Pressable
                  style={{ alignItems: 'center' }}
                  onPress={closeModal}
                >
                  <IconSymbol name="ellipsis.message" size={40} color="#000" />
                  <Text style={{ marginTop: 10 }}>Advisor</Text>
                </Pressable>
              </Link>
            </View>
          </View>

          {/* Close Button */}
          <Pressable
            style={{
              backgroundColor: '#333',
              padding: 15,
              borderRadius: 10,
              marginTop: 30,
            }}
            onPress={onClose}
          >
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              Close
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

export default ActionModal

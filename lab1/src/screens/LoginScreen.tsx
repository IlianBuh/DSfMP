import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<any>();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            Alert.alert('Ошибка авторизации', error.message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <TextInput 
                placeholder="Email" 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none"
            />
            <TextInput 
                placeholder="Пароль" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
            />
            <Button title="Войти" onPress={handleLogin} />
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Нет аккаунта? Регистрация</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    buttonContainer: {
        marginBottom: 20,
    },
    linkText: {
        color: '#007AFF',
        textAlign: 'center',
        marginTop: 10,
    }
});
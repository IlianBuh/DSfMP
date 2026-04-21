// RegisterScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation<any>();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Ошибка', 'Пароли не совпадают');
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            Alert.alert('Ошибка при регистрации', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Регистрация</Text>
            
            <TextInput 
                style={styles.input}
                placeholder="Email" 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput 
                style={styles.input}
                placeholder="Пароль" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
            />
            <TextInput 
                style={styles.input}
                placeholder="Подтвердите пароль" 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                secureTextEntry 
            />
            
            <View style={styles.buttonContainer}>
                <Button title="Зарегистрироваться" onPress={handleRegister} />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Уже есть аккаунт? Войти</Text>
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
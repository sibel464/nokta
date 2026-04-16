import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

export default function App() {
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [inputText, setInputText] = useState('');
  const [step, setStep] = useState(0);
  const [spec, setSpec] = useState<any>(null);

  const questions = [
    "What specific problem does this idea solve?",
    "Who is the exact target user or customer?",
    "What is the MVP scope? What will we NOT build?",
    "What are the biggest technical or market constraints?"
  ];

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsgs = [...messages, { role: 'user', text: inputText }];
    setMessages(newMsgs as {role: 'user'|'ai', text: string}[]);
    setInputText('');

    if (step < questions.length) {
      setTimeout(() => {
        setMessages([...newMsgs, { role: 'ai', text: questions[step] }]);
        setStep(step + 1);
      }, 500);
    } else {
      setTimeout(() => {
        setSpec({
          Idea: newMsgs[0].text,
          Problem: newMsgs[1]?.text || 'N/A',
          User: newMsgs[2]?.text || 'N/A',
          Scope: newMsgs[3]?.text || 'N/A',
          Constraint: newMsgs[4]?.text || 'N/A'
        });
      }, 500);
    }
  };

  const reset = () => {
    setMessages([]);
    setStep(0);
    setSpec(null);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.header}>Nokta - Track A (Dot to Spec)</Text>
      
      {!spec ? (
        <>
          <ScrollView style={styles.chatArea}>
            {messages.length === 0 && (
              <Text style={styles.placeholderText}>Enter your raw idea spark to begin...</Text>
            )}
            {messages.map((m, i) => (
              <View key={i} style={m.role === 'ai' ? styles.msgAi : styles.msgUser}>
                <Text style={m.role === 'ai' ? styles.textAi : styles.textUser}>{m.text}</Text>
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder={step === 0 ? "Type your idea..." : "Answer..."}
              onSubmitEditing={handleSend}
            />
            <Button title="Send" onPress={handleSend} />
          </View>
        </>
      ) : (
        <ScrollView style={styles.specArea}>
          <Text style={styles.specHeader}>Generated Spec (Page)</Text>
          <Text style={styles.specProp}>Idea: {spec.Idea}</Text>
          <Text style={styles.specProp}>Problem: {spec.Problem}</Text>
          <Text style={styles.specProp}>User: {spec.User}</Text>
          <Text style={styles.specProp}>Scope: {spec.Scope}</Text>
          <Text style={styles.specProp}>Constraints: {spec.Constraint}</Text>
          <Button title="Start Over" onPress={reset} />
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f5', paddingTop: 50 },
  header: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  chatArea: { flex: 1, padding: 10 },
  placeholderText: { textAlign: 'center', color: '#888', marginTop: 20 },
  msgAi: { alignSelf: 'flex-start', backgroundColor: '#e5e5ea', padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '80%' },
  msgUser: { alignSelf: 'flex-end', backgroundColor: '#007aff', padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '80%' },
  textAi: { color: '#000' },
  textUser: { color: '#fff' },
  inputArea: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc', backgroundColor: '#fff' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginRight: 10 },
  specArea: { flex: 1, padding: 20, backgroundColor: '#fff', margin: 10, borderRadius: 10 },
  specHeader: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  specProp: { fontSize: 16, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 }
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';

export default function App() {
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [inputText, setInputText] = useState('');
  const [step, setStep] = useState(0);
  const [spec, setSpec] = useState<any>(null);

  const questions = [
    "What specific problem does this idea solve in the market?",
    "Who is the exact target user? Define your persona.",
    "What is the MVP scope? What will we explicitly NOT build?",
    "What are our technical or go-to-market constraints?"
  ];

  const getPhaseName = () => {
    if (step === 0) return "Spark (Dot)";
    if (step === 1 || step === 2) return "Expanding (Line)";
    if (step === 3 || step === 4) return "Structuring (Paragraph)";
    return "Artifact (Page)";
  };

  const currentPhase = getPhaseName();

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsgs: {role: 'user'|'ai', text: string}[] = [...messages, { role: 'user', text: inputText }];
    setMessages(newMsgs);
    setInputText('');

    if (step < questions.length) {
      setTimeout(() => {
        setMessages([...newMsgs, { role: 'ai', text: questions[step] }]);
        setStep(step + 1);
      }, 600);
    } else {
      setTimeout(() => {
        setSpec({
          Idea: newMsgs[0].text,
          Problem: newMsgs[1]?.text || 'N/A',
          User: newMsgs[2]?.text || 'N/A',
          Scope: newMsgs[3]?.text || 'N/A',
          Constraint: newMsgs[4]?.text || 'N/A'
        });
      }, 600);
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
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Nokta Ideation Engine</Text>
        <Text style={styles.phaseIndicator}>Current Phase: {currentPhase}</Text>
      </View>
      
      {!spec ? (
        <>
          <ScrollView style={styles.chatArea}>
            {messages.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.placeholderTitle}>Drop a Dot.</Text>
                <Text style={styles.placeholderText}>Enter an unrefined idea to begin the engineering-guided expansion process...</Text>
              </View>
            ) : (
              messages.map((m, i) => (
                <View key={i} style={m.role === 'ai' ? styles.msgAi : styles.msgUser}>
                  <Text style={m.role === 'ai' ? styles.textAi : styles.textUser}>{m.text}</Text>
                </View>
              ))
            )}
          </ScrollView>
          
          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder={step === 0 ? "Describe your raw idea..." : "Provide constraints/answers..."}
              onSubmitEditing={handleSend}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
              <Text style={styles.sendBtnTxt}>Submit</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <ScrollView style={styles.specArea}>
          <Text style={styles.specHeader}>📄 The Golden Spec</Text>
          <Text style={styles.specSub}>Your dot has been structured into a slop-free artifact.</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardLabel}>CORE IDEA</Text>
            <Text style={styles.cardValue}>{spec.Idea}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>PROBLEM</Text>
            <Text style={styles.cardValue}>{spec.Problem}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>TARGET USER</Text>
            <Text style={styles.cardValue}>{spec.User}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>MVP SCOPE</Text>
            <Text style={styles.cardValue}>{spec.Scope}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>CONSTRAINTS</Text>
            <Text style={styles.cardValue}>{spec.Constraint}</Text>
          </View>
          
          <TouchableOpacity style={styles.resetBtn} onPress={reset}>
            <Text style={styles.resetBtnTxt}>Create New Specification</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', paddingTop: 60, paddingBottom: 20 },
  headerContainer: { paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderColor: '#333' },
  header: { fontSize: 24, fontWeight: '900', color: '#fff', textAlign: 'center' },
  phaseIndicator: { fontSize: 13, color: '#00D8FF', textAlign: 'center', marginTop: 5, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  chatArea: { flex: 1, padding: 15 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  placeholderTitle: { fontSize: 24, fontWeight: '800', color: '#444', marginBottom: 10 },
  placeholderText: { textAlign: 'center', color: '#555', fontSize: 15, paddingHorizontal: 20 },
  msgAi: { alignSelf: 'flex-start', backgroundColor: '#333', padding: 14, borderRadius: 16, marginVertical: 6, maxWidth: '85%' },
  msgUser: { alignSelf: 'flex-end', backgroundColor: '#00D8FF', padding: 14, borderRadius: 16, marginVertical: 6, maxWidth: '85%' },
  textAi: { color: '#E0E0E0', fontSize: 16, lineHeight: 22 },
  textUser: { color: '#000', fontSize: 16, fontWeight: '500', lineHeight: 22 },
  inputArea: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderColor: '#222', backgroundColor: '#111', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#444', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 12, marginRight: 10, fontSize: 16, color: '#fff', backgroundColor: '#222' },
  sendBtn: { backgroundColor: '#00D8FF', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12 },
  sendBtnTxt: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  specArea: { flex: 1, padding: 20 },
  specHeader: { fontSize: 28, fontWeight: '900', color: '#00D8FF', marginBottom: 5 },
  specSub: { color: '#888', fontSize: 14, marginBottom: 25 },
  card: { backgroundColor: '#222', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#333' },
  cardLabel: { fontSize: 12, color: '#00D8FF', fontWeight: 'bold', marginBottom: 5, letterSpacing: 1 },
  cardValue: { fontSize: 16, color: '#fff', lineHeight: 24 },
  resetBtn: { marginTop: 20, backgroundColor: '#444', borderRadius: 15, padding: 15, alignItems: 'center' },
  resetBtnTxt: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

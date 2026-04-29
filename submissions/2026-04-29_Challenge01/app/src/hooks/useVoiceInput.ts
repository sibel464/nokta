import { useEffect, useState, useCallback } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

interface VoiceInputState {
  listening: boolean;
  transcript: string;
  error: string | null;
}

export function useVoiceInput() {
  const [state, setState] = useState<VoiceInputState>({ listening: false, transcript: '', error: null });

  useSpeechRecognitionEvent('result', (e) => {
    const text = e.results?.[0]?.transcript ?? '';
    if (text) setState((s) => ({ ...s, transcript: text }));
  });
  useSpeechRecognitionEvent('end', () => setState((s) => ({ ...s, listening: false })));
  useSpeechRecognitionEvent('error', (e) => setState((s) => ({ ...s, listening: false, error: e.error })));

  const start = useCallback(async () => {
    setState({ listening: true, transcript: '', error: null });
    const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!perm.granted) {
      setState({ listening: false, transcript: '', error: 'Mikrofon izni reddedildi' });
      return;
    }
    ExpoSpeechRecognitionModule.start({ lang: 'tr-TR', interimResults: true });
  }, []);

  const stop = useCallback(() => {
    ExpoSpeechRecognitionModule.stop();
    setState((s) => ({ ...s, listening: false }));
  }, []);

  useEffect(() => {
    return () => {
      try {
        ExpoSpeechRecognitionModule.stop();
      } catch {
        /* noop */
      }
    };
  }, []);

  return { ...state, start, stop };
}

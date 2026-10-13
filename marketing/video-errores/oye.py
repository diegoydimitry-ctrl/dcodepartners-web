import sherpa_onnx as s, soundfile as sf, numpy as np, sys
from scipy.signal import resample_poly
r = s.OfflineRecognizer.from_whisper(encoder='sherpa-onnx-whisper-small/small-encoder.int8.onnx', decoder='sherpa-onnx-whisper-small/small-decoder.int8.onnx', tokens='sherpa-onnx-whisper-small/small-tokens.txt', language='es', task='transcribe', num_threads=2)
for f in sys.argv[1:]:
    x, sr = sf.read(f, dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    if sr != 16000: x = resample_poly(x, 16000, sr).astype('float32')
    st = r.create_stream(); st.accept_waveform(16000, x); r.decode_stream(st); print(f, '→', st.result.text)

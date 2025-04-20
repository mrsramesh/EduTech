// // import React from 'react';
// // import { View, Text, StyleSheet } from 'react-native';

// // export default function ChatScreen() {
// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.text}>💬 calling Screen</Text>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// //   text: { fontSize: 24, fontWeight: 'bold' },
// // });


// import React, { useEffect, useRef, useState } from 'react';
// import { View } from 'react-native';
// import {
//   RTCPeerConnection as RTCPC,
//   RTCView,
//   mediaDevices,
//   MediaStream,
// } from 'react-native-webrtc';
// import io from 'socket.io-client';

// // Explicit cast to bypass incomplete type declarations from react-native-webrtc
// const RTCPeerConnection = RTCPC as any;

// const socket = io('http://localhost:5000');

// const configuration = {
//   iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
// };

// const VideoCall = () => {
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const pc = useRef<any>(new RTCPeerConnection(configuration)); // Use any to bypass type issues

//   useEffect(() => {
//     const startLocalStream = async () => {
//       const stream: MediaStream = await mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });

//       // Force-cast to expected shape to avoid TS error
//       setLocalStream(stream as unknown as MediaStream);

//       stream.getTracks().forEach(track => {
//         pc.current.addTrack(track, stream);
//       });
//     };

//     startLocalStream();

//     socket.emit('join-room', 'room1');

//     socket.on('user-joined', async (userId: string) => {
//       const offer = await pc.current.createOffer();
//       await pc.current.setLocalDescription(offer);
//       socket.emit('signal', { to: userId, signal: offer });
//     });

//     socket.on('signal', async (data: any) => {
//       if (data.signal.type === 'offer') {
//         await pc.current.setRemoteDescription(data.signal);
//         const answer = await pc.current.createAnswer();
//         await pc.current.setLocalDescription(answer);
//         socket.emit('signal', { to: data.from, signal: answer });
//       } else if (data.signal.type === 'answer') {
//         await pc.current.setRemoteDescription(data.signal);
//       } else if (data.signal.candidate) {
//         await pc.current.addIceCandidate(data.signal);
//       }
//     });

//     // Handle ICE candidate
//     pc.current.onicecandidate = (event: any) => {
//       if (event.candidate) {
//         socket.emit('signal', { to: 'other-user-id', signal: event.candidate });
//       }
//     };

//     // Handle remote stream
//     pc.current.ontrack = (event: any) => {
//       const stream = event.streams?.[0];
//       if (stream) {
//         setRemoteStream(stream as unknown as MediaStream);
//       }
//     };
//   }, []);

//   return (
//     <View>
//       {localStream && (
//         <RTCView
//           streamURL={localStream.toURL()}
//           style={{ width: 150, height: 200 }}
//         />
//       )}
//       {remoteStream && (
//         <RTCView
//           streamURL={remoteStream.toURL()}
//           style={{ width: 150, height: 200 }}
//         />
//       )}
//     </View>
//   );
// };

// export default VideoCall;

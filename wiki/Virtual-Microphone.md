# Virtual Microphone (Discord, Zoom, Games)

VoxRelay can send the generated speech to a virtual audio cable. On Windows the bundled driver is **VB-Audio Virtual Cable**.

## Routing

VoxRelay plays audio into **CABLE Input** (virtual playback device). Discord, Zoom and games must capture **CABLE Output** (virtual recording device).

1. Install VB-Cable during VoxRelay setup. If necessary, restart Windows.
2. In VoxRelay choose **Settings → Virtual microphone**, and ensure the cable is detected.
3. Enable the **virtual mic** in the Speak screen.
4. In Discord open **User Settings → Voice & Video → Input Device** and select **CABLE Output (VB-Audio Virtual Cable)**.
5. Use the built-in test or speak a phrase while another person listens.

If no cable is detected, speech may still play on local speakers but **will not reach the call**. Verify device permissions and selected device. Do not select `CABLE Input` as Discord's input device.

See [full troubleshooting](Troubleshooting) or [the detailed project guide](https://github.com/forgiobombi/TTS/blob/main/docs/VIRTUAL_MIC.md).

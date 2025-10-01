import { useEffect, useState } from "react";

const bootMessages = [
  "OWASP Framework successfully initialized",
  "Using 16384 buffer headers and 10240 cluster IO buffer headers",
  "IOAPIC: Version 0x20 Vectors 64:87",
  "ACPI: System State [S0 S3 S4 S5] (S3)",
  "PFM64 0xf10000000, 0xf0000000",
  "[ PCI configuration begin ]",
  "IntelCPUPowerManagement: Turbo Ratios 0046",
  "IntelCPUPowerManagement: (built 13:08:12 Jun 18 2011) initialization complete",
  "console relocated to 0xf10000000",
  "PCI configuration changed (bridge=16 device=4 cardbus=0)",
  "[ PCI configuration end, bridges 12 devices 16 ]",
  "mbinit: done (64 MB total pool size, (42/21) split)",
  "Pthread support ABORTS when sync kernel primitives misused",
  "com.owasp.FSCompressionType2lib kmod start",
  "com.owasp.BootScreen kmod start",
  "com.owasp.FSCompressionType2lib load succeeded",
  "com.owasp.FSCompressionTypeDataless load succeeded",
  "",
  "IntelCPUPowerManagementClient: ready",
  "ARCOEXIST off",
  "wl0: Broadcom BCM4331 802.11 Wireless Controller",
  "5.100.98.75",
  "",
  "FireWire (OHCI) Lucent ID 5901 built-in now active, GUID c82a14fffee4a086; max speed s800.",
  "rooting via boot-uuid from /chosen: F9670083-AC74-33D3-B361-AC1977EB4AA2",
  'Waiting on <dict ID="0"><key>IOProviderClass</key><string ID="1">',
  'IOResources</string><key>IOResourceMatch</key><string ID="2">boot-uuid-media</string></dict>',
  "Got boot device = IOService:/ACPIPlatformExpert/PCI0@0/ACPIPCI/SATA@1F,2/",
  "IntelCPUPowerManagementClient: ready",
  "BSD root: disk0s2, major 14, minor 2",
  "Kernel is LP64",
  "IOThunderboltSwitch::i2cWriteWord - status = 0xe00002ed",
  "IOThunderboltSwitch::i2cWriteWord - status = 0xd0000000",
  "IOThunderboltSwitch::i2cWriteWord - status = 0xe00002ed",
  "IOThunderboltSwitch::i2cWriteWord - status = 0xe00002ed",
  "ODAGUSBMultiTouchDriver::checkStatus - received Status Packet, Payload 2: device was reinitialized",
  "MottiaScrub::checkstatus - true, MottiaScrub",
  "[IOBluetoothHCIController::setConfigState] calling registerService",
  "AirPort_Brcm4331: Ethernet address e4:ce:8f:46:18:d2",
  "systemShutdownCause was set to: 0 (Shutdown complete(): adding SPINVRAM notification",
  "IOB02l1Interface::scfffffF800c32ca8h0x0",
  "Created VirtIO scfffffF800c32ca8h0x0",
  "BCM5701Enet: Ethernet address c8:2a:14:57:a4:7a",
  "Previous Shutdown Cause: 3",
  "NTFS driver 3.8 [Flags: R/W].",
  "NTFS volume name_BOOTCAMP, version 3.1.",
  "DSMOS has arrived",
  "en1: 802.11d country code set to 'US'.",
  "en1: Supported channels 1 2 3 4 5 6 7 8 9 10 11 36 40 44 48 52 56 60 64 100 104 108 112 116 120 124 128 132 136 140 149 153 157 161 165",
  "at highest",
  "MacAuthEvent en1 Auth result for: 00:60:64:1e:e9:e4 MAC AUTH succeeded",
  "MacAuthEvent en1 Auth result for: 00:60:64:1e:e9:e4 Unsolicited Auth",
  "wlEvent: en1 en1 Link UP",
  "AirPort: Link Up on en1",
  "en1: BSSID changed to 00:60:64:1e:e9:e4",
  "virtual bool IOHIDEventSystemUserClient::initWithTask(task*, void*, UInt32):",
  "client task not privileged to open IOHIDSystem for mapping memory (e0002c1)",
  "",
  "Boot Complete",
];

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence = ({ onComplete }: BootSequenceProps) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < bootMessages.length) {
      const delay =
        bootMessages[currentIndex] === "" ? 100 : Math.random() * 50 + 20;

      const timer = setTimeout(() => {
        setMessages((prev) => [...prev, bootMessages[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(finalTimer);
    }
  }, [currentIndex, onComplete]);

  return (
    <div className="fixed inset-0 bg-background scanlines overflow-hidden">
      <div className="h-full w-full overflow-y-auto terminal-scroll p-4">
        <div className="max-w-full">
          <div className="text-primary text-xs leading-relaxed font-mono">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className="boot-text"
                style={{
                  animationDelay: `${idx * 0.02}s`,
                }}
              >
                {msg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

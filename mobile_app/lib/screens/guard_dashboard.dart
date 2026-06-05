import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../api.dart';

class GuardDashboard extends StatefulWidget {
  const GuardDashboard({super.key});

  @override
  State<GuardDashboard> createState() => _GuardDashboardState();
}

class _GuardDashboardState extends State<GuardDashboard> {
  final MobileScannerController cameraController = MobileScannerController();
  bool _isProcessing = false;

  void _onDetect(BarcodeCapture capture) async {
    if (_isProcessing) return;
    
    final List<Barcode> barcodes = capture.barcodes;
    if (barcodes.isNotEmpty && barcodes.first.rawValue != null) {
      final String code = barcodes.first.rawValue!;
      setState(() => _isProcessing = true);
      
      try {
        final success = await ApiService.approveVisitorScan(code);
        if (success) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Visitor Approved & Logged!'), backgroundColor: Colors.green));
          }
        } else {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Invalid or Expired QR Code'), backgroundColor: Colors.red));
          }
        }
      } catch (e) {
        if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
      
      // Prevent immediate double scan
      await Future.delayed(const Duration(seconds: 3));
      if (mounted) setState(() => _isProcessing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Security Scanner'),
      ),
      body: Stack(
        children: [
          MobileScanner(
            controller: cameraController,
            onDetect: _onDetect,
          ),
          Positioned(
             bottom: 40,
             left: 0,
             right: 0,
             child: Center(
               child: Container(
                 padding: const EdgeInsets.all(12),
                 color: Colors.black54,
                 child: const Text('Point camera at Visitor QR Code', style: TextStyle(color: Colors.white, fontSize: 18)),
               )
             )
          ),
          if (_isProcessing)
             const Center(child: CircularProgressIndicator())
        ],
      ),
    );
  }
}

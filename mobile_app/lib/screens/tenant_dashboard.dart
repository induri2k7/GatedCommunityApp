import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../api.dart';

class TenantDashboard extends StatefulWidget {
  final int tenantId;
  final String name;
  const TenantDashboard({super.key, required this.tenantId, required this.name});

  @override
  State<TenantDashboard> createState() => _TenantDashboardState();
}

class _TenantDashboardState extends State<TenantDashboard> {
  String? _generatedQrCode;
  bool _isLoading = false;

  void _generatePreApproval() async {
    setState(() => _isLoading = true);
    final visitor = await ApiService.createVisitor('Pre-approved Guest', 'Guest Phone', 'Visit', widget.tenantId);
    if(mounted) setState(() => _isLoading = false);

    if (visitor != null) {
      setState(() {
        _generatedQrCode = visitor['qr_code'];
      });
      if(mounted) {
        showDialog(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Gate Pass Generated'),
            content: SizedBox(
               width: 200,
               height: 200,
               child: QrImageView(
                 data: _generatedQrCode!,
                 version: QrVersions.auto,
                 size: 200.0,
               ),
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close'))
            ],
          )
        );
      }
    } else {
        if(mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to generate pass')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Welcome, ${widget.name}')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildActionCard(context, Icons.qr_code, 'Generate QR', Colors.blue, _generatePreApproval),
                _buildActionCard(context, Icons.history, 'Visitor Logs', Colors.purple, () {}),
              ],
            ),
            const SizedBox(height: 20),
            if (_isLoading) const CircularProgressIndicator()
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard(BuildContext context, IconData icon, String title, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        width: MediaQuery.of(context).size.width * 0.4,
        padding: const EdgeInsets.symmetric(vertical: 24),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.5)),
        ),
        child: Column(
          children: [
            Icon(icon, size: 40, color: color),
            const SizedBox(height: 10),
            Text(title, style: TextStyle(fontWeight: FontWeight.bold, color: color)),
          ],
        ),
      ),
    );
  }
}

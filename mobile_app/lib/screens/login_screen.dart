import 'package:flutter/material.dart';
import '../api.dart';
import 'tenant_dashboard.dart';
import 'guard_dashboard.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _mobileController = TextEditingController();
  final _passwordController = TextEditingController();
  final _ipController = TextEditingController(text: "http://localhost:8000/api"); // Default local backend
  bool _isLoading = false;

  void _login() async {
    setState(() => _isLoading = true);
    
    try {
      ApiService.baseUrl = _ipController.text;
      final data = await ApiService.login(_mobileController.text, _passwordController.text);
      if (data != null && data['access_token'] != null) {
        await ApiService.saveToken(data['access_token'], 'temp');
        
        final user = await ApiService.getMe();
        if (user != null) {
          final role = user['role'];
          final id = user['id'];
          
          if (!mounted) return;
          
          if (role == 'tenant') {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => TenantDashboard(tenantId: id, name: user['first_name'])),
            );
          } else if (role == 'security_guard') {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const GuardDashboard()),
            );
          } else {
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Unsupported role for mobile app.')));
          }
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Invalid credentials')));
      }
    } catch(e) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Network Error: $e')));
    } finally {
      if(mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('VMS SaaS Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text("Ensure Backend is running! If on physical device, change IP below.", style: TextStyle(color: Colors.red)),
            const SizedBox(height: 10),
            TextField(
              controller: _ipController,
              decoration: const InputDecoration(labelText: 'API Base URL', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _mobileController,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(labelText: 'Mobile Number (+971...)', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Password', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 20),
            _isLoading 
              ? const Center(child: CircularProgressIndicator())
              : ElevatedButton(
                  onPressed: _login,
                  style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(16)),
                  child: const Text('Login', style: TextStyle(fontSize: 18)),
                ),
          ],
        ),
      ),
    );
  }
}

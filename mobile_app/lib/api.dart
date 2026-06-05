import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

// Use your PC's local IP address if testing on a physical device. 
// e.g. "http://192.168.1.100:8000/api"
// "http://10.0.2.2:8000/api" is for Android Emulator
class ApiService {
  static String baseUrl = "http://localhost:8000/api";

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  static Future<void> saveToken(String token, String role) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('jwt_token', token);
    await prefs.setString('user_role', role);
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
    await prefs.remove('user_role');
  }

  static Future<Map<String, dynamic>?> login(String mobile, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: {'username': mobile, 'password': password},
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      // We will parse role out of decoded JWT usually, or get from /users/me
      return data;
    }
    return null;
  }

  static Future<Map<String, dynamic>?> getMe() async {
    final token = await getToken();
    if (token == null) return null;
    final response = await http.get(
      Uri.parse('$baseUrl/users/me'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return null;
  }

  static Future<Map<String, dynamic>?> createVisitor(String name, String phone, String purpose, int tenantId) async {
    final token = await getToken();
    final response = await http.post(
      Uri.parse('$baseUrl/visitors/'),
      headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'phone': phone,
        'purpose': purpose,
        'visitor_type': 'guest',
        'tenant_id': tenantId
      }),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return null;
  }

  static Future<bool> approveVisitorScan(String qrCode) async {
    final token = await getToken();
    final response = await http.put(
      Uri.parse('$baseUrl/visitors/$qrCode/approve'),
      headers: {'Authorization': 'Bearer $token'},
    );
    return response.statusCode == 200;
  }

  static Future<List<dynamic>> getVisitors() async {
    final token = await getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/visitors/'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return [];
  }
}

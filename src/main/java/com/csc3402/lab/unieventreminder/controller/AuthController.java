package com.csc3402.lab.unieventreminder.controller;

import com.csc3402.lab.unieventreminder.model.EventRecord;
import com.csc3402.lab.unieventreminder.model.User;
import com.csc3402.lab.unieventreminder.repository.EventRecordRepository;
import com.csc3402.lab.unieventreminder.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Controller
public class AuthController {

    private final UserService userService;

    @Autowired
    private EventRecordRepository eventRecordRepository;
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // 1. log in
    @GetMapping("/login")
    public String showLoginPage() {
        return "login";
    }

    // 2. log in
    @PostMapping("/login")
    public String handleLogin(@RequestParam("email") String email,
                              @RequestParam("password") String password,
                              HttpSession session,
                              Model model) {
        Optional<User> userOptional = userService.loginUser(email, password);
        System.out.println("Trying to login with email: " + email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            session.setAttribute("loggedInUser", user);

            if ("admin".equalsIgnoreCase(user.getRole())) {
                return "redirect:/admin-dashboard";
            } else {
                return "redirect:/dashboard";
            }
        } else {
            model.addAttribute("error", "Invalid email or password!");
            return "login";
        }

    }

    // 3. register
    @GetMapping("/register")
    public String showRegisterPage(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    // 4. sing in
    @PostMapping("/register")
    public String handleRegister(@ModelAttribute("user") User user, Model model) {
        try {
            userService.registerUser(user);
            return "redirect:/login";
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
            return "register";
        }
    }

    // 5. logo out
    @GetMapping("/logout")
    public String handleLogout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }

    // 6. Index
    @GetMapping("/")
    public String showIndexPage() {
        return "index";
    }

    // 7. API
    @GetMapping("/api/events")
    @ResponseBody
    public List<EventRecord> getAllEvents() {
        try {
            List<EventRecord> list = eventRecordRepository.findAll();
            if (list == null) {
                return new ArrayList<>();
            }
            return list;
        } catch (Exception e) {
            System.err.println(" " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    //  API ID
    @GetMapping("/api/events/{id}")
    @ResponseBody
    public EventRecord getEventById(@PathVariable Long id) {
        return eventRecordRepository.findById(id).orElse(null);
    }

    // (Dashboard)
    @GetMapping("/dashboard")
    public String showDashboard(HttpSession session, Model model) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null) {
            return "redirect:/login";
        }
        model.addAttribute("userName", user.getFullName());
        model.addAttribute("userDepartment", user.getDepartment());
        return "student-dashboard";
    }
    @GetMapping("/event-details")
    public String showEventDetailsPage() {
        return "event-details";
    }
    @GetMapping("/api/current-user")
    @ResponseBody
    public Map<String, Object> getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getUserId());
            response.put("fullName", user.getFullName());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            response.put("department", user.getDepartment());
            return response;
        }
        return null;
    }
    @GetMapping("/my-events")
    public String showMyEvents() {
        return "my-events";
    }

    @GetMapping("/profile")
    public String showProfilePage(HttpSession session, Model model) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null) {
            return "redirect:/login";
        }
        model.addAttribute("user", user);
        return "profile";
    }
    @GetMapping("/reminders")
    public String showRemindersPage(HttpSession session, Model model) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user == null) {
            return "redirect:/login";
        }
        model.addAttribute("user", user);
        return "reminders";
    }
}
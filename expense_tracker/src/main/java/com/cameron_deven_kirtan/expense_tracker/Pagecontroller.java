package com.cameron_deven_kirtan.expense_tracker;

import org.springframework.stereotype.Controller; // <-- Correct import
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;

@Controller
public class Pagecontroller {

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/budget")
    public String budget() {
        return "budget";
    }
}

package pl.pistolrange.pistolrange_server.api;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import pl.pistolrange.pistolrange_server.api.dto.QuestionDto;
import pl.pistolrange.pistolrange_server.service.AdminService;

@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;


    @PostMapping("/import")
    public void importQuestions (@RequestBody QuestionDto questionDto){
        adminService.importQuestions(questionDto);
    }
}

package pl.pistolrange.pistolrange_server.api;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pl.pistolrange.pistolrange_server.api.dto.QuestionDto;
import pl.pistolrange.pistolrange_server.domain.QuestionEntity;
import pl.pistolrange.pistolrange_server.mapper.QuestionMapper;
import pl.pistolrange.pistolrange_server.service.AdminService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;
    private final QuestionMapper questionMapper;

    @PostMapping("/import")
    public void importQuestions(@RequestBody List<QuestionDto> questionListDto) {
        List<QuestionEntity> questionEntityList = questionListDto.stream().map(questionMapper::mapToDomain).toList();
        adminService.importQuestions(questionEntityList);
    }

    @GetMapping("/export")
    public List<QuestionDto> exportQuestions() {
        return adminService.exportQuestions();
    }
}

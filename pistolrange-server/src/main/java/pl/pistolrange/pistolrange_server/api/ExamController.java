package pl.pistolrange.pistolrange_server.api;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.pistolrange.pistolrange_server.api.dto.QuestionDto;
import pl.pistolrange.pistolrange_server.service.ExamService;

import java.util.List;

@RequestMapping("/exam")
@RestController
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @GetMapping("/load")
    public List<QuestionDto> loadQuestionsForExam(){
        return examService.loadQuestionsForExam();
    }
}

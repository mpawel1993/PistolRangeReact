package pl.pistolrange.pistolrange_server.api;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.pistolrange.pistolrange_server.api.dto.ExamDetailsDto;
import pl.pistolrange.pistolrange_server.api.dto.QuestionDto;
import pl.pistolrange.pistolrange_server.mapper.ExamMapper;
import pl.pistolrange.pistolrange_server.service.ExamService;

import java.util.List;

@RequestMapping("/exam")
@RestController
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;
    private final ExamMapper examMapper;

    @GetMapping("/load")
    public List<QuestionDto> loadQuestionsForExam(){
        return examService.loadQuestionsForExam();
    }

    @GetMapping("/details")
    public ExamDetailsDto getExamDetails(){
        return examMapper.toDto(examService.getExamDetails());
    }
}

package pl.pistolrange.pistolrange_server.api;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.pistolrange.pistolrange_server.api.dto.QuestionDto;
import pl.pistolrange.pistolrange_server.service.LearnService;

@RestController
@RequiredArgsConstructor
public class LearnController {

    private final LearnService learnService;

    @GetMapping
    public QuestionDto getQuestionsByCategory(){
        return learnService.getQuestionByCategory();
    }


}

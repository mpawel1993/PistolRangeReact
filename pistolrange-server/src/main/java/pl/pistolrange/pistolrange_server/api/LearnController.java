package pl.pistolrange.pistolrange_server.api;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pl.pistolrange.pistolrange_server.api.dto.QuestionDto;
import pl.pistolrange.pistolrange_server.domain.WeaponLawCategory;
import pl.pistolrange.pistolrange_server.service.LearnService;

import java.util.List;

@RequestMapping("/learn")
@RestController
@RequiredArgsConstructor
@CrossOrigin
public class LearnController {

    private final LearnService learnService;

    @GetMapping("/category/{category}/{randomQuestions}")
    public List<QuestionDto> getQuestionsByCategory(
            @PathVariable("category") String category,
            @PathVariable("randomQuestions") boolean randomQuestions
    ){
        var cat = WeaponLawCategory.valueOf(category.toUpperCase());
        return learnService.getQuestionByCategory(cat, randomQuestions);
    }
}

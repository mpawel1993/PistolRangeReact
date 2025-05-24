package pl.pistolrange.pistolrange_server.api;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

    @GetMapping("/category")
    public List<QuestionDto> getQuestionsByCategory(){
        return learnService.getQuestionByCategory(WeaponLawCategory.WSZYSTKIE);
    }
}
